import BaseComponent from "../components/BaseComponent.js";
import RoundedRect from '../components/RoundedRect.js';
import Text from "../components/Text.js";
import LevelSelectScreen from "../levelSelectScreen/index.js";
import CharSelect from "./charSelect/index.js";

export default class TitleScreen extends BaseComponent {

  constructor() {
    super();
    this.active = true;
    this.withSize({w:800, h:600}).withSprite('backgroundGround');
    this.addChild(new Text('TO THE SKIES!', {color:'#ff0000', weight: 900}).withPosition({x:0,y:-200}).withSize({w:600,h:100}))
    this.addChild(new RoundedRect({radius:5, color:'#88ff88'})
      .withPosition({x:0,y:-100}).withSize({w:200,h:80})
      .onClick(e => {
        if (!this.active) {
          return;
        }
        console.log('CLICK PLAY')
        this.purge();
        this.parent.addChild(new LevelSelectScreen());
      })
      .withChild(new Text('PLAY', {color:'#008800'}).withSize({w:150,h:80}))
    );
    this.addChild(new RoundedRect({radius:5, color:'#88ff88'}).withPosition({x:0,y:0}).withSize({w:200,h:80})
      .onClick(e => {
        if (!this.active) {
          return;
        }
        console.log('CLICK SHOP')
        this.active = false;
        this.addChild(new CharSelect());
      })
      .withChild(new Text('SHOP', {color:'#008800'}).withSize({w:150,h:80}))
    );
    this.addChild(new RoundedRect({radius:5, color:'#88ff88'}).withPosition({x:0,y:100}).withSize({w:200,h:80})
      .onClick(e => {
        if (!this.active) {
          return;
        }
        console.log('CLICK OPTIONS')
      })
      .withChild(new Text('OPTIONS', {color:'#008800'}).withSize({w:150,h:80}))
    );
  }

}