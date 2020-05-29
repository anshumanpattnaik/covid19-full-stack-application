import React, { Component } from "react";
import { connect } from "react-redux";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
import { Bar } from "react-chartjs-2";
import { GoGraph } from "react-icons/go";

import {
  fetchCoronaStatistics,

} from "../actions";
import { MAP_STYLE_ACTION, MAP_FLY_ACTION } from "../actions/constants";

class Chart extends Component {
  state = {};

  componentDidMount() {
    this.props.fetchCoronaStatistics();
  }

  renderStatistics() {
    var data = JSON.parse(JSON.stringify(this.props.statistics)).results;
    if (data.country_statistics !== undefined) {
      var totalConfirmed = data.total_confirmed;
      var totalDeaths = data.total_deaths;
      var totalRecovered = data.total_recovered;
      var date = data.last_date_updated;

      var statistics = data.country_statistics;
      let cases = [];
      let country = [];
      var x = statistics.map((e) => {
        if (e.confirmed > 10000) {
          country.push(e.country);
          cases.push(e.confirmed);
        }
      });
      return {
        labels: country,
        datasets: [
          {
            label: "Confirmed cases",
            backgroundColor: "rgb(182, 109, 41)",
            borderColor: "rgb(182, 109, 41)",
            borderWidth: 1,
            data: cases,
          },
        ],
      };
    }
  }
  render() {
    return (
      <div className="chartcontainer">
        <Bar
          data={this.renderStatistics()}
          options={{
            title: {
              display: true,
              text: "Total confirmed cases",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    );
  }
}
const stateProps = (state) => ({
  statistics: state.statistics,
});
const dispatchProps = (dispatch) => ({
  fetchCoronaStatistics: () => dispatch(fetchCoronaStatistics()),
});

export default connect(stateProps, dispatchProps)(Chart);
