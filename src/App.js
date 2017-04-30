import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

class App extends Component {
  
  keywordsInputChange$ = new Subject();
  
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <div className="nav-bar-styling">
          <a href="#">Home</a>
          <a href="#">Puns</a>
          <a href="#">Github</a>
        </div>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to the React and RxJS Pun App</h2>
        </div>
        <div> 
        </div>
        <div>
          <input type="text" placeholder="Enter keywords!" onChange={this.keywordsInputChange$.next.bind(this.keywordsInputChange$)}/>
          {this.state.tracy}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.subscription = this.keywordsInputChange$
      .map(e => e.target.value)
      .delay(1000)
      .subscribe(value => this.setState({
      tracy: value
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
