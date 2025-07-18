import BaseComponent from "../components/BaseComponent.js";
import TitleScreen from "../titleScreen/index.js";

export default class RootComponent extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:400, y:300}).withSize({w:800, h:600});
    this.addChild(new TitleScreen());
  }

}