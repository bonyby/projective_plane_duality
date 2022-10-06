import React, { PureComponent } from 'react'
import './App.css';
import View from './views';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      primalElements: ["p(5,8)"]
    };
  }

  render() {
    return (
      <div className="App">
        <View title="Primal" primalElements={this.state.primalElements} />
        <View title="Dual" primalElements={this.state.primalElements} />
      </div>
    )
  }
}
