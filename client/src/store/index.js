import {createStore, applyMiddleware,compose} from "redux";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducers';

const middle = applyMiddleware(thunk, logger);
const store = createStore(rootReducer,   compose(
    middle,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    // window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

export default store;