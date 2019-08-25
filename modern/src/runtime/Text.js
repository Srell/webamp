import GuiObject from "./GuiObject";
import { unimplementedWarning } from "../utils";

class Text extends GuiObject {
  /**
   * getclassname()
   *
   * Returns the class name for the object.
   * @ret The class name.
   */
  getclassname() {
    return "Text";
  }

  setalternatetext(txt) {
    unimplementedWarning("setalternatetext");
  }

  settext(txt) {
    unimplementedWarning("settext");
    return;
  }

  gettext() {
    unimplementedWarning("gettext");
    return;
  }

  gettextwidth() {
    unimplementedWarning("gettextwidth");
    return;
  }

  ontextchanged(newtxt) {
    unimplementedWarning("ontextchanged");
    return;
  }
}

export default Text;
