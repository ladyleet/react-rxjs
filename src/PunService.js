import { Observable } from 'rxjs/Observable';
import { asap } from 'rxjs/scheduler/asap';
import 'rxjs/add/observable/dom/ajax';

export class PunService {

  constructor() { }

  suggestKeywords(partial) {
    return Observable.ajax.getJSON(`https://localhost:4201/suggest-keywords?q=${partial}`)
      .catch(err => {
        console.error(err);
        return Observable.empty();
      });
  }

  getPuns(kwds) {
    const serialized = kwds.join(',');
    return Observable.ajax.getJSON(`https://localhost:4201/puns?q=${serialized}`)
      .catch(err => {
        console.error(err);
        return Observable.empty();
      });
  }
}