import React, { createRef, Component } from 'react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { connect } from 'react-redux';

import { MAPBOX_ACCESS_TOKEN, MAP_STYLE_ACTION, MAP_FLY_ACTION } from '../../actions/constants';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

var map = null;

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            matches: window.matchMedia("(min-width: 1000px)").matches
        }
    }
    mapboxElRef = createRef();

    componentDidMount() {
        var mapStyle = JSON.parse(JSON.stringify(this.props.style)).style;
        map = new mapboxgl.Map({
            container: this.mapboxElRef.current,
            style: mapStyle,
            center: [16, 27],
            zoom: 2,
        });
        this.renderMap(map);
    }

    renderMap = (map) => {
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, this.state.matches?'bottom-right':'top-right');

        fetch('https://covid19-api.hackbotone.com/markers.geojson')
            .then(response => response.json())
            .then(data =>
                map.once('load', function () {
                    map.addSource('points', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: data
                        }
                    });
                    map.addLayer({
                        id: 'circles',
                        source: 'points',
                        type: 'circle',
                        paint: {
                            'circle-opacity': 0.75,
                            'circle-radius': [
                                'interpolate', ['linear'],
                                ['get', 'total_cases'],
                                1,
                                4,
                                1000,
                                8,
                                4000,
                                10,
                                8000,
                                14,
                                12000,
                                18,
                                100000,
                                40,
                                250000,
                                100
                            ],
                            'circle-color': '#EA240F'
                        }
                    });
                    const popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false
                    });

                    let previous_id;

                    map.on('mousemove', 'circles', (e) => {
                        const key = e.features[0].properties.key;
                        if (key !== previous_id) {
                            const { name, confirmed, deaths, recovered } = e.features[0].properties;
                            map.getCanvas().style.cursor = 'pointer';

                            const coordinates = e.features[0].geometry.coordinates.slice();
                            const HTML = `<html> <style type="text/css"> @import url('https://fonts.googleapis.com/css2?family=Lato&family=Roboto:ital,wght@0,400;0,500;1,300&display=swap'); body { font-family: 'Roboto', sans-serif; font-family: 'Lato', sans-serif; } .header-title { font-family: 'Roboto', sans-serif; font-family: 'Lato', sans-serif; font-size: 15px; font-weight: bold; color: #000000; } .flex-container { height: 30px; display: flex; flex-wrap: nowrap; } .dot-container { width: 20px; height: 30px; display: flex; justify-content: center; align-items: center; } .title-container { width: 95px; height: 30px; display: flex; align-items: center; } .statistics-container { width: 80px; height: 30px; display: flex; justify-content: flex-end; align-items: center; } .confirmed-dot { width: 8px; height: 8px; border-radius: 50px; background-color: #DA1400; } .deaths-dot { width: 8px; height: 8px; border-radius: 50px; background-color: #525252; } .recovered-dot { width: 8px; height: 8px; border-radius: 50px; background-color: #3BD202; } .statistics-label { font-family: 'Roboto', sans-serif; font-size: 12px; } .statistics-count { font-family: 'Roboto', sans-serif; font-size: 12px; } </style> <body> <table cellpadding=0 cellspacing=0 border="0" width="200" height="40"> <tr> <td align="center" "> <span class=" header-title ">${name}</span> </td> </tr> </table> <table cellpadding=0 cellspacing=0 border="0" width="200" height="90"> <tr> <td align="center" class="flex-container"> <div class="dot-container"><div class="confirmed-dot"></div></div> <div class="title-container"><span class="statistics-label">Confirmed</span></div> <div class="statistics-container"><span class="statistics-count">${confirmed}</span></div> </td> </tr> <tr> <td align="center" class="flex-container"> <div class="dot-container"><div class="deaths-dot"></div></div> <div class="title-container"><span class="statistics-label">Deaths</span></div> <div class="statistics-container"><span class="statistics-count">${deaths}</span></div> </td> </tr> <tr> <td align="center" class="flex-container"> <div class="dot-container"><div class="recovered-dot"></div></div> <div class="title-container"><span class="statistics-label">Recovered</span></div> <div class="statistics-container"><span class="statistics-count">${recovered}</span></div> </td> </tr> </table> </body> </html>`;

                            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                            }
                            popup.setLngLat(coordinates).setHTML(HTML).addTo(map);
                        }
                    });

                    map.on('mouseleave', 'circles', function () {
                        previous_id = undefined;
                        map.getCanvas().style.cursor = '';
                        popup.remove();
                    });
                })
            );
    }

    render() {
        var actionType = JSON.parse(JSON.stringify(this.props.action)).action;
        if(actionType.action !== undefined){
            var action = actionType.action;
            var mapStyle = JSON.parse(JSON.stringify(this.props.style)).style;
            var statistics = JSON.parse(JSON.stringify(this.props.countryStatistics)).statistics;

            if (mapStyle.style !== undefined && action === MAP_STYLE_ACTION) {
                map = new mapboxgl.Map({
                    container: this.mapboxElRef.current,
                    style: mapStyle.style,
                    center: [16, 27],
                    zoom: 2,
                });
                this.renderMap(map);
            }
            if (map !== null && action === MAP_FLY_ACTION) {
                if (statistics.item !== undefined) {
                    map.flyTo({
                        center: statistics.item,
                        zoom: 4,
                        bearing: 0,
                        speed: 1,
                        curve: 1,
                        easing: function (t) {
                            return t;
                        },
                        essential: true
                    });
                }
            }
        }
        return (
            <div className="mapbox-container">
                <div className="mapBox" ref={this.mapboxElRef} />
            </div>
        );
    }
}

const stateProps = state => ({
    countryStatistics: state.countryStatistics,
    style: state.style,
    action: state.action
});

export default connect(stateProps, null)(MapComponent);
