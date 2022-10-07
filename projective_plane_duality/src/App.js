import React, { PureComponent } from 'react'
import './App.css';
import View from './views';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // primalObjects: ["p(150,8)", "p(1, 55)", "p(250, 370)"]
      primalObjects: [["p", 2, -50]]
    };
  }

  dualizeObjects() {
    const objects = [];

    this.state.primalObjects.forEach(o => {
      const type = o[0];
      switch (type) {
        case "p":
          // const regex = /\(|\)|\s/ig; // Regex (global) to remove all '(', ')' and ' '
          // const [x, y] = val.replaceAll(regex, "").split(",");
          const x = o[1];
          const y = o[2];
          objects.push(["l", x, -y]) // p(p_x,p_y) => y=p_x*x-p_y
          break;
        default:
          console.log("SADNESS!");
          break;
      }
    });

    return objects;
  }

  render() {
    return (
      <div className="App">
        <View title="Primal" objects={this.state.primalObjects} />
        <View title="Dual" objects={this.dualizeObjects(this.state.primalObjects)} />
      </div>
    )
  }
}
