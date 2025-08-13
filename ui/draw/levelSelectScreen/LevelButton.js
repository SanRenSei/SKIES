import BaseComponent from "../../core/components/BaseComponent.js";
import Ring from "../../core/components/Ring.js";
import Text from "../../core/components/Text.js";

export default class LevelButton extends BaseComponent {

  constructor({levelNum}) {
    super();
    this.withPosition({x:125*((levelNum-1)%5)-250,y:125*Math.floor((levelNum-1)/5)-250})
      .withChild(new Ring({thickness:10,color:'#888888'}).withSize({w:100,h:100}).onHover(() => this.setColor('#88ff88')).onUnhover(() => this.setColor('#888888')))
      .withChild(new Ring({thickness:35,color:'#888888'}).withSize({w:70,h:70}))
      .withChild(new Text(levelNum, {color:'#660066'}).withSize({w:35,h:35}));
  }

  setColor(col) {
    this.children.filter(c => c instanceof Ring).forEach(c => c.color=col);
  }

  onClick(handler) {
    this.children[0].onClick(handler);
    return this;
  }

}