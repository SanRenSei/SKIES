import BaseComponent from "../components/BaseComponent.js";
import CollisionShape from "../components/CollisionShape.js";
import Gravity from "../components/Gravity.js";
import Oval from "../components/Oval.js";
import Rect from "../components/Rect.js";
import Text from "../components/Text.js";
import drawManager from "../DrawManager.js";
import LevelSelectScreen from "../levelSelectScreen/index.js";
import GameplayScreen from "./index.js";

export default class WinPopup extends BaseComponent {

  constructor() {
    super();
    this.absolutePosition = true;
    this.withPosition({x:drawManager.width/2,y:drawManager.height/2});
    this.addChild(new Rect({fillColor:'#bbbbbb'}).withSize({w:drawManager.width/2,h:drawManager.height/2}));
    this.addChild(new Text('Level clear!', {color:'green',weight:700}).withPosition({x:0,y:-150}).withSize({w:200,h:100}))
    this.addChild(BaseComponent.createSprite('happyGhost', {x:0,y:0,w:150,h:150}));
    this.addChild(new Oval({fillColor:'#ffbbbb'}).withPosition({x:-70,y:120}).withSize({w:100,h:80})
      .withChild(new Text('Return to map', {color:'black'}).withSize({w:80,h:60}))
      .onClick(() => {
        this.parent.purge();
        this.parent.parent.addChild(new LevelSelectScreen());
      }));
    this.addChild(new Oval({fillColor:'#bbbbff'}).withPosition({x:70,y:120}).withSize({w:100,h:80})
      .withChild(new Text('Next Level', {color:'black'}).withSize({w:80,h:60}))
      .onClick(() => {
        this.parent.purge();
        this.parent.parent.addChild(new GameplayScreen({levelNum: this.parent.levelNum+1}));
      }));
  }

}