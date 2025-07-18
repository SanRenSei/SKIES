import BaseComponent from "../components/BaseComponent.js";
import RoundedRect from '../components/RoundedRect.js';
import Text from "../components/Text.js";
import GameplayScreen from "../gameplayScreen/index.js";
import LevelButton from "./LevelButton.js";

export default class LevelSelectScreen extends BaseComponent {

  constructor() {
    super();
    this.withSize({w:800, h:600}).withSprite('backgroundGround');
    this.addChild(new Text('LEVEL SELECT', {color:'#ff0000', weight: 900}).withPosition({x:0,y:-200}).withSize({w:600,h:100}))
    for (let i=1;i<=50;i++) {
      this.addChild(new LevelButton({levelNum:i}).onClick(() => {
        this.purge();
        this.parent.addChild(new GameplayScreen({levelNum: i}));
      }));
    }
  }

}