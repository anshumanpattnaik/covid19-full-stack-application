import {combineReducers} from 'redux';

import statisticsReducer from '../reducers/statisticsReducer';
import countryStatisticsReducer from '../reducers/countryStatisticsReducer';
import markersReducer from '../reducers/markersReducer';
import mapStyleReducer from '../reducers/mapStyleReducer';
import setActionReducer from '../reducers/setActionReducer';

const rootReducer = combineReducers({
    statistics: statisticsReducer,
    countryStatistics: countryStatisticsReducer,
    markers: markersReducer,
    style: mapStyleReducer,
    action: setActionReducer
});

export default rootReducer;