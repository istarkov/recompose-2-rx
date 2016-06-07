// `npm bin`/mocha --compilers js:babel-register --reporter min --watch './tests/*.spec.js'
// import expect from 'expect';
import { Observable } from 'rxjs/Observable';
import { createChangeEmitter } from 'change-emitter';
import flow from 'lodash/flow';
import { mapProps, withState, withHandlers } from '../src';


describe('A', () => {
  it('B', () => {
    const propsEmitter = createChangeEmitter();

    const props$ = Observable.create(observer =>
      propsEmitter.listen(props => observer.next(props))
    );

    const newProps = flow(
      mapProps(({ a }) => ({
        a: a * 3,
      })),
      mapProps(({ a }) => ({
        a: a + 1,
      })),
      withState('counter', 'setCounter', 0),
      withHandlers({
        onChange: (props) => (args) => {
          console.log('args:', args, 'props:', props);
        },
      })
    );

    newProps(props$)
      .subscribe((v) => (v.counter === 0 && v.setCounter(1), console.log(v), v.onChange('xx')));


    propsEmitter.emit({ a: 1 });
    propsEmitter.emit({ a: 2 });
    propsEmitter.emit({ a: 3 });
  });
});
