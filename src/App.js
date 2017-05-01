import React, { Component } from 'react';
import logo from './logo.svg';
import rxjsLogo from './rxjs-transparent.png';
import './App.css';
import NavBar from './NavBar';
import ChangeTheme from './ChangeTheme';
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
        
        <div className="Right-align Font-75em">
          <a className="Margin-left-right-10" href="#">HOME</a>
          <a className="Margin-left-right-10" href="#">ABOUT</a>
          <a className="Margin-left-right-10" href="#">CHANGE THEME</a>
          <a className="Margin-left-right-10" href="http://github.com/ladyleet/react-rxjs">GITHUB</a>
        </div>
        
        <div className="App-header">
          <div className="Center-align">
            <img src={rxjsLogo} className="App-logo" alt="logo" />
            <h5 className="Rxjs-pink">PUN MACHINE BUILT WITH CREATE-REACT-APP AND RXJS</h5>
          </div>
        </div>

        <div className="Center-align">
          <input className="Margin-left-right-10" type="text" placeholder="ENTER KEYWORDS" onChange={this.keywordsInputChange$.next.bind(this.keywordsInputChange$)}/>
          <button className="Rxjs-pink-background White-text Margin-left-right-10" onClick={this.listenClick$.next.bind(this.listenClick$)}>
            SEARCH BY VOICE
          </button>
          <button className="Rxjs-pink-background White-text Margin-left-right-10">
            TAKE A PICTURE
          </button>
        </div>
         
         <div>
          <h5 className="Rxjs-pink">KEYWORDS AVAILABLE</h5>
          <div>
            {this.state.keywords}
          </div>
         </div>
         
         <div>
           <h5 className="Rxjs-pink">HERE'S SOME PUNS</h5>
           <div>
             {this.state.puns && this.state.puns.map((pun, i) => <div key={i}>
              {pun.pun}
              {pun.answer}
            </div>)}
           </div>
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
