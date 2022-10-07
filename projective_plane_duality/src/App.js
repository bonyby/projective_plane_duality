import React, { PureComponent } from 'react'
import './App.css';
import View from './views';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      primalObjects: ["p(150,8)", "p(1, 55)", "p(250, 370)"]
    };
  }

  render() {
    return (
      <div className="App">
        <View title="Primal" objects={this.state.primalObjects} />
        <View title="Dual" objects={this.state.primalObjects} />
      </div>
    )
  }
}
