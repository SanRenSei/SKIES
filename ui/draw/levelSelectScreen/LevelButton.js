import BaseComponent from "../components/BaseComponent.js";
import Ring from "../components/Ring.js";
import Text from "../components/Text.js";

export default class LevelButton extends BaseComponent {

  constructor({levelNum}) {
    super();
    this.withPosition({x:100*((levelNum-1)%5)-250,y:75*Math.floor((levelNum-1)/5)-100})
      .withChild(new Ring({thickness:5,color:'#888888'}).withSize({w:50,h:50}).onHover(() => this.setColor('#88ff88')).onUnhover(() => this.setColor('#888888')))
      .withChild(new Ring({thickness:15,color:'#888888'}).withSize({w:30,h:30}))
      .withChild(new Text(levelNum, {color:'#660066'}).withSize({w:15,h:15}));
  }

  setColor(col) {
    this.children.filter(c => c instanceof Ring).forEach(c => c.color=col);
  }

  onClick(handler) {
    this.children[0].onClick(handler);
    return this;
  }

}