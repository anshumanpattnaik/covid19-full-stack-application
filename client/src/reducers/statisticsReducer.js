import {FETCH_CORONA_STATISTICS} from '../actions/constants';

const initialState = {
    results: '',
};

const statisticsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CORONA_STATISTICS: {
        const newState = {
          ...state,
          results: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
};
  
export default statisticsReducer;