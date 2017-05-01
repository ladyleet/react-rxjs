import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import { PunService } from './PunService';
import { SpeechService } from './SpeechService';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/merge';

const punService = new PunService(); 
const speechService = new SpeechService();

class App extends Component {  
  keywordsInputChange$ = new Subject();
  
  listenClick$ = new Subject();

  keywordFromText$ = this.keywordsInputChange$
    .map(e => e.target.value)
    .switchMap(value => punService.suggestKeywords(value));

  keywordFromSpeech$ = this.listenClick$
    .switchMap(() => speechService.listen())
    .map(x => x.map(x => x.toLowerCase()))

  keyword$ = Observable.merge(
    this.keywordFromText$.do(x => console.log(x)),
    this.keywordFromSpeech$.do(x => console.log(x))
  )
  .do(x => console.log('->', x))

  pun$ = this.keyword$
    .do(x => console.log('->', x))
    .switchMap(value => punService.getPuns(value))

  state$ = Observable.merge(
    this.pun$.map(puns => ({ type: 'PUNS', puns })),
    this.keyword$.map(keywords => ({ type: 'KEYWORDS', keywords }))
  ).scan((state, action) => {
    switch (action.type) {
      case 'KEYWORDS':
        return { ...state, keywords: action.keywords };
      case 'PUNS':
        return { ...state, puns: action.puns };
      default:
        return state;
    }
  });

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
          <button onClick={this.listenClick$.next.bind(this.listenClick$)}>
            Listen to your own voice return a pun
          </button>
          {this.state.keywords}
          {this.state.puns && this.state.puns.map((pun, i) => <div key={i}>
            {pun.pun}
            {pun.answer}
          </div>)}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.subscription = this.state$.subscribe(state => this.setState(state));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
