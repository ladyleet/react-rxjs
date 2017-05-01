import { Observable } from 'rxjs/Observable';

// TODO: get this injected properly
const SpeechRecognition = window && (
  (window).SpeechRecognition || (window).webkitSpeechRecognition || 
  (window).mozSpeechRecognition || (window).msSpeechRecogntion
);

export class SpeechService {
  constructor() {
  }

  listen() {
    return new Observable(observer => 
   {
      const speech = new SpeechRecognition();

      const resultHandler = (e) => {
        const results = this.cleanSpeechResults(e.results);
        observer.next(results);
        observer.complete();
      };

      const errorHandler = (err) => {
        observer.error(err);
      };

      speech.addEventListener('result', resultHandler);
      speech.addEventListener('error', errorHandler);
      speech.start();

      return () => {
        speech.removeEventListener('result', resultHandler);
        speech.removeEventListener('error', errorHandler);
        speech.abort();
      };
    });
  }

  cleanSpeechResults(results) {
    return (
      Array.from(results)
        .reduce(
          (final, result) =>
            final.concat(Array.from(result, (x) => x.transcript)),
          []
        )
    );
  }
}
