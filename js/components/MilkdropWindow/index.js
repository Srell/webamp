import React from "react";
import screenfull from "screenfull";
import ContextMenuWrapper from "../ContextMenuWrapper";
import MilkdropContextMenu from "./MilkdropContextMenu";

import Presets from "./Presets";
import Milkdrop from "./Milkdrop";
import Background from "./Background";

// This component is just responsible for loading dependencies.
// This simplifies the inner <Milkdrop /> component, by allowing
// it to alwasy assume that it has it's dependencies.
export default class PresetsLoader extends React.Component {
  constructor() {
    super();
    this.state = { presets: null, butterchurn: null, isFullscreen: false };
    this._handleFullscreenChange = this._handleFullscreenChange.bind(this);
    this._handleRequestFullsceen = this._handleRequestFullsceen.bind(this);
  }

  async componentDidMount() {
    const {
      butterchurn,
      presetKeys,
      minimalPresets
    } = await loadInitialDependencies();

    this.setState({
      butterchurn,
      presets: new Presets({
        keys: presetKeys,
        initialPresets: minimalPresets,
        getRest: loadNonMinimalPresets
      })
    });
    screenfull.onchange(this._handleFullscreenChange);
  }

  componentWillUnmount() {
    screenfull.off("change", this._handleFullscreenChange);
  }

  _handleFullscreenChange() {
    this.setState({ isFullscreen: screenfull.isFullscreen });
  }

  _handleRequestFullsceen() {
    if (screenfull.enabled) {
      if (!screenfull.isFullscreen) {
        screenfull.request(this._wrapperNode);
      } else {
        screenfull.exit();
      }
    }
  }

  render() {
    const { butterchurn, presets } = this.state;
    const loaded = butterchurn != null && presets != null;

    const width = this.state.isFullscreen ? screen.width : this.props.width;

    const height = this.state.isFullscreen ? screen.height : this.props.height;

    return (
      <ContextMenuWrapper
        onDoubleClick={this._handleRequestFullsceen}
        renderContents={() => (
          <MilkdropContextMenu
            close={this.props.close}
            toggleFullscreen={this._handleRequestFullsceen}
          />
        )}
      >
        <Background innerRef={node => (this._wrapperNode = node)}>
          {loaded && (
            <Milkdrop
              {...this.props}
              width={width}
              height={height}
              isFullscreen={this.state.isFullscreen}
              presets={presets}
              butterchurn={butterchurn}
            />
          )}
        </Background>
      </ContextMenuWrapper>
    );
  }
}

async function loadInitialDependencies() {
  return new Promise((resolve, reject) => {
    require.ensure(
      [
        "butterchurn",
        "butterchurn-presets/lib/butterchurnPresetsMinimal.min",
        "butterchurn-presets/lib/butterchurnPresetPackMeta.min"
      ],
      require => {
        const butterchurn = require("butterchurn");
        const butterchurnMinimalPresets = require("butterchurn-presets/lib/butterchurnPresetsMinimal.min");
        const presetPackMeta = require("butterchurn-presets/lib/butterchurnPresetPackMeta.min");
        resolve({
          butterchurn,
          minimalPresets: butterchurnMinimalPresets.getPresets(),
          presetKeys: presetPackMeta.getMainPresetMeta().presets
        });
      },
      reject,
      "butterchurn"
    );
  });
}

async function loadNonMinimalPresets() {
  return new Promise((resolve, reject) => {
    require.ensure(
      ["butterchurn-presets/lib/butterchurnPresetsNonMinimal.min"],
      require => {
        resolve(
          require("butterchurn-presets/lib/butterchurnPresetsNonMinimal.min").getPresets()
        );
      },
      reject,
      "butterchurn-presets"
    );
  });
}
