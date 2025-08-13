import BaseComponent from "../../../core/components/BaseComponent.js";
import Rect from "../../../core/components/Rect.js";
import Text from "../../../core/components/Text.js";
import playerChars from "../../../data/playerChars.js";
import AnimatedSprite from "../../../core/components/AnimatedSprite.js";
import Oval from "../../../core/components/Oval.js";
import gameState from "../../../state/GameState.js";
import drawManager from "../../../core/DrawManager.js";

export default class CharSelect extends BaseComponent {

  constructor() {
    super();
    this.selectedChar = gameState.playerAvatar;
    this.addChild(new Rect({fillColor: '#FFAEC9'}).withSize({w:drawManager.width/2,h:drawManager.height/2}));
    this.addChild(new Rect({fillColor: '#FFC90E'}).withPosition({x:0,y:-drawManager.height/4+25}).withSize({w:drawManager.width/2,h:50})
      .withChild(new Text('Character Select').withSize({w:200,h:50}))
    );
    this.addChild(new Rect({fillColor: '#B5E61D'}).withPosition({x:0,y:drawManager.height/4-25}).withSize({w:drawManager.width/2,h:50})
      .withChild(new Text('BACK').withSize({w:50,h:50}))
      .onClick(() => {
        this.purge();
        this.parent.active = true;
      })
    );
    this.setSelectedChar(0);
    this.addChild(new Oval({fillColor: '#000000'}).withPosition({x:-100,y:0}).withSize({w:50,h:50})
      .withChild(new Text('<', {color: '#ffffff', weight: 700}).withSize({w:30,h:30}))
      .onClick(() => {this.setSelectedChar(this.selectedChar-1)})
    );
    this.addChild(new Oval({fillColor: '#000000'}).withPosition({x:100,y:0}).withSize({w:50,h:50})
      .withChild(new Text('>', {color: '#ffffff', weight: 700}).withSize({w:30,h:30}))
      .onClick(() => {this.setSelectedChar(this.selectedChar+1)})
    );
  }

  setSelectedChar(charNum) {
    if (charNum<0) {
      charNum = playerChars.length-1;
    }
    if (charNum>playerChars.length-1) {
      charNum = 0;
    }
    this.selectedChar = charNum;
    gameState.playerAvatar = this.selectedChar;
    this.char?.purge();
    if (playerChars[this.selectedChar].animated) {
      this.char = new BaseComponent().withSize({w:100,h:100});
      this.char.withChild(new AnimatedSprite(this, playerChars[this.selectedChar].right, playerChars[this.selectedChar].frames));
    } else {
      this.char = BaseComponent.createSprite(playerChars[this.selectedChar].right, {x:0,y:0,w:100,h:100});
    }
    this.addChild(this.char);
  }

}