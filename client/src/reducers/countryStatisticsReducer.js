import {SHOW_COUNTRY_STATISTICS} from '../actions/constants';

const initialState = {
  statistics: '',
};

const countryStatisticsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_COUNTRY_STATISTICS: {
        const newState = {
          ...state,
          statistics: action.payload,
        };
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default countryStatisticsReducer;