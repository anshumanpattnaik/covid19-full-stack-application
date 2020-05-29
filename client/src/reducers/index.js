import {combineReducers} from 'redux';

import statisticsReducer from '../reducers/statisticsReducer';
import countryStatisticsReducer from '../reducers/countryStatisticsReducer';
import markersReducer from '../reducers/markersReducer';
import mapStyleReducer from '../reducers/mapStyleReducer';
import setActionReducer from '../reducers/setActionReducer';
import DisplayReducer from '../reducers/ShowChart'


const rootReducer = combineReducers({
    statistics: statisticsReducer,
    countryStatistics: countryStatisticsReducer,
    markers: markersReducer,
    style: mapStyleReducer,
    action: setActionReducer,
    Dislplay:DisplayReducer
});

export default rootReducer;