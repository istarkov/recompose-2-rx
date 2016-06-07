/* eslint-disable no-param-reassign */
import 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/combineLatest';

export const mapProps = (propsMapper) => ($props) => $props.map(propsMapper);

export const withHandlers = (handlers) => (props$) => {
  let currentProps;
  const callers = Object.keys(handlers).reduce(
    (r, k) => {
      r[k] = (...args) => {
        const handler = handlers[k](currentProps);
        return handler(...args);
      };
      return r;
    },
    {}
  );

  return props$
    .do(props => {
      currentProps = props;
    })
    .map(
      (props) => ({
        ...props,
        ...callers,
      })
    );
};

export const withState = (stateName, stateUpdaterName, initialState) => (props$) => {
  // const state = ;
  const subj = new BehaviorSubject(initialState);

  return props$.combineLatest(subj, (props, state) => ({
    ...props,
    [stateName]: state,
    [stateUpdaterName]: (v) => subj.next(v),
  }));
};
