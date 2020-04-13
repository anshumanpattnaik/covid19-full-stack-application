import {SET_ACTION} from '../actions/constants';

const initialState = {
  action: '',
};

const setActionReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ACTION: {
        const newState = {
          ...state,
          action: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default setActionReducer;