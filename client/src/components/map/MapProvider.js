import React, {Component} from 'react';

import MapComponent from './MapComponent';
import Chart from '../Chart'
import { connect } from 'react-redux';

class MapProvider extends Component {
  state={
    show:this.props.Dislplay
  }
 
  render() {

  
    return(
      <div>
    {this.props.Dislplay.Dislplay && <div className="mapbox-container">
      <Chart/>
    </div>}
   {!this.props.Dislplay.Dislplay &&  <MapComponent />}
    </div>

     
    ) 
  }
}

const stateProps = state => ({
  statistics: state.statistics,
  Dislplay:state.Dislplay
});

export default connect(stateProps)(MapProvider);

