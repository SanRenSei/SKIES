import BaseComponent from "../../core/components/BaseComponent.js";
import drawManager from "../../core/DrawManager.js";
import TitleScreen from "../titleScreen/index.js";

export default class RootComponent extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:drawManager.width/2, y:drawManager.height/2}).withSize({w:drawManager.width, h:drawManager.height});
    this.addChild(new TitleScreen());
  }

}