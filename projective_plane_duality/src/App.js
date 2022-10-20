import React, { PureComponent } from 'react'
import './App.css';
import View from './views';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // primalObjects: [["p", 1, 1], ["p", 3, 3], ["p", 6, 6], ["p", 9, 9], ["p", -1, -1], ["p", -3, -3], ["p", -6, -6], ["p", -9, -9]]
      // primalObjects: [["p", 1, 1], ["p", -1.5, -5], ["p", -0.5, -1.4]]
      // primalObjects: [["l", 1, -1], ["p", -1, -1], ["p", -0.8, -1.5], ["p", 3, 1], ["p", 4, -2.5], ["p", 0.5, -2]]
      primalObjects: []
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.addObject();
    }
  }

  addObject() {
    const input = document.getElementById("input");
    const txt = input.value;

    const [valid, object] = this.getInput(txt);

    if (!valid) { return; }

    input.value = "";

    const newObjects = this.state.primalObjects.slice();
    newObjects.push(object);
    this.setState({
      primalObjects: newObjects
    });
  }

  getInput(txt) {
    const validTypes = ["p", "l"];
    if (!validTypes.includes(txt[0])) { return [false, []]; }

    // TODO: Do some checks based on type

    return [true, [txt[0], txt[2], txt[4]]];
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
        case "l":
          const a = o[1];
          const b = o[2];
          objects.push(["p", a, -b]);
          break;
        default:
          console.log("SADNESS!: " + o);
          break;
      }
    });

    return objects;
  }

  listElementClicked(index) {
    // Add element to input
    const element = this.state.primalObjects[index];
    document.getElementById("input").value = this.objectToString(element);
    
    // Remove from primal objects
    const newObjects = this.state.primalObjects.slice();
    newObjects.splice(index, 1);
    this.setState({
      primalObjects: newObjects
    });
  }

  objectToString(object) {
    switch(object[0]) {
      case "p":
        return "p(" + object[1] + "," + object[2] + ")";
      case "l":
        return "l(" + object[1] + "," + object[2] + ")";
      default:
        return "sadness and despair"
    }
  }

  getListElements() {
    const elements = this.state.primalObjects.map((element, index) => {
      return <li key={element[0] + index} onClick={() => this.listElementClicked(index)}>{this.objectToString(element)}</li>;
    });
    return elements;
  }

  render() {
    const listElements = this.getListElements();

    return (
      <div className="App">
        <div id="inputContainer">
          <input id="input" type="text" placeholder="e.g.: p(1,3)"></input>
          <ul id="inputList">
            {listElements}
          </ul>
        </div>
        <View title="Primal" width={500} height={500} xMax={10} yMax={10} objects={this.state.primalObjects} />
        <View title="Dual" width={500} height={500} xMax={10} yMax={10} objects={this.dualizeObjects(this.state.primalObjects)} />
      </div>
    )
  }
}

export default App;