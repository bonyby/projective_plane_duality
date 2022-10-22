import React from 'react'
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
    const type = txt[0]
    const validTypes = ["p", "l", "s"];
    if (!validTypes.includes(type)) { return [false, []]; }

    // TODO: Do some checks based on type
    // Get values of the input text
    const regex = /\(|\)|\s/ig; // Regex (global) to remove all '(', ')' and ' '
    const vals = txt.slice(1).replaceAll(regex, "").split(",");
    const result = [type].concat(vals);

    return [true, result];
  }

  dualizeObjects() {
    const objects = [];

    this.state.primalObjects.forEach(o => {
      const type = o[0];
      switch (type) {
        case "p":
          const x = o[1];
          const y = o[2];
          objects.push(["l", x, -y]) // p(p_x,p_y) => y=p_x*x-p_y
          break;
        case "l":
          const a = o[1];
          const b = o[2];
          objects.push(["p", a, -b]);
          break;
        case "s":
          const x1 = o[1];
          const y1 = o[2];
          const x2 = o[3];
          const y2 = o[4];
          objects.push(["w", x1, -y1, x2, -y2]);
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
    const [type, ...vals] = object;

    const valsString = vals.slice(1).reduce((str, val) => str + "," + val, vals[0]);
    return type + "(" + valsString + ")";
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
        <div id="howToContainer">
          <h1>How To!</h1>
          <h2>Input Commands:</h2>
          <ul>
            <li>Point: p(x,y) - <i>e.g. p(1,3)</i></li>
            <li>Line: l(a,b) - <i>e.g. l(2,1)</i></li>
            <li>Segment: s(x1,y1,x2,y2)<br></br> - <i>e.g. l(1,1,2,2)</i></li>
          </ul>
          <h2>Editing:</h2>
          <p>To edit an object, simply click on it in the input list.
            This removes the item and adds it back to the input field for editing.</p>
        </div>
        <div id="inputContainer">
          <h1>Input</h1>
          <input id="input" type="text" placeholder="e.g.: p(1,3)"></input>
          <h2>Objects:</h2>
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