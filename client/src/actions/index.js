import {
    FETCH_CORONA_STATISTICS,
    SHOW_COUNTRY_STATISTICS,
    FETCH_MARKERS,
    MAP_STYLE,
    SET_ACTION,
    BASE_URL,
} from './constants';

export const dispatchStatistics = data => ({
    type: FETCH_CORONA_STATISTICS,
    payload: data
});

export const dispatchMarkers = data => ({
    type: FETCH_MARKERS,
    payload: data
});

export const fetchCoronaStatistics = () => dispatch => {
    fetch(BASE_URL)
    .then(response =>  response.json())
    .then(data => {
       dispatch(dispatchStatistics(data));
    })
}

export const fetchMarkers = () => dispatch => {
    fetch(BASE_URL+"markers.geojson")
    .then(response =>  response.json())
    .then(data => {
       dispatch(dispatchMarkers(data));
    })
}

export const showCountryStatistics = item => ({
    type: SHOW_COUNTRY_STATISTICS,
    payload: {item}
})

export const setMapStyle = style => ({
    type: MAP_STYLE,
    payload: {style}
})

export const setAction = action => ({
    type: SET_ACTION,
    payload: {action}
})