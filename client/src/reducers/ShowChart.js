 import {SHOW_CHART} from '../actions/constants';

const initialState = {
    Dislplay: false,
};

const DisplayReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_CHART: {
        const newState = {
          ...state,
          Dislplay: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
};
  
export default DisplayReducer;