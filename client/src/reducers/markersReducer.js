import {FETCH_MARKERS} from '../actions/constants';

const initialState = {
  markers: '',
};

const markersReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_MARKERS: {
        const newState = {
          ...state,
          markers: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default markersReducer;