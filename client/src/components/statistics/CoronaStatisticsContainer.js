import React, { Component } from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { OrbitSpinner } from 'react-epic-spinners';
import FlatList from 'flatlist-react';

import { fetchCoronaStatistics, showCountryStatistics, setMapStyle, setAction } from '../../actions';
import { MAP_STYLE_ACTION, MAP_FLY_ACTION } from '../../actions/constants';

class CoronaStatisticsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAboutModal: false,
      isSelected: -1,
      tabMenuSelect: 1,
      tabSelectedtPos: -1,
      statistics: [],
      matches: window.matchMedia("(min-width: 1000px)").matches
    }
    this.filter_statistics = [];
  }

  componentDidMount() {
    this.props.fetchCoronaStatistics();
  }

  showCountryStatistics = (item, index) => {
    if (this.state.matches) {
      this.setState({
        isSelected: index
      })
    } else {
      this.setState({
        isSelected: index,
        tabSelectedtPos: 2,
        tabMenuSelect: 2
      })
    }
    this.props.setAction(MAP_FLY_ACTION);
    this.props.showCountryStatistics(item.coordinates)
  }

  onTabSelection = (index) => {
    if (index === 3) {
      this.setState({
        tabSelectedtPos: index,
        tabMenuSelect: index,
        isAboutModal: true
      })
    } else {
      this.setState({
        tabSelectedtPos: index,
        tabMenuSelect: index,
        isAboutModal: false
      })
    }
  }

  onSetMapStyle = (mapStyle) => {
    this.props.setAction(MAP_STYLE_ACTION);
    this.props.setMapStyle(mapStyle);
  }

  onSetAboutModal = (isShown) => {
    this.setState({
      isAboutModal: isShown
    })
  }

  renderItem = (item, index) => {

    return (
      <div key={item.country} className={'country-statistics-container'}>
        <div className={this.state.isSelected === index ? 'country-selected-list-container' : 'country-list-container'} onClick={this.showCountryStatistics.bind(this, item, index)}>
          <div className={'country-name-container'}>
            <img src={item.flag} alt={item.country} className={'country-flag'} />
            <span className={'country-name-txt'}>{item.country === 'US' ? 'United States' : item.country}</span>
          </div>
          <div className={'country-statistics-container'}>
            <NumberFormat
              className={'country-statistics-txt'}
              value={item.confirmed}
              displayType={'text'}
              thousandSeparator={true}
            />
            <span className={'country-statistics-label-txt'}>CONFIRMED</span>
          </div>
          <div className={'country-statistics-container'}>
            <NumberFormat
              className={'country-statistics-txt'}
              value={item.deaths}
              displayType={'text'}
              thousandSeparator={true}
            />
            <span className={'country-statistics-label-txt'}>DEATHS</span>
          </div>
          <div className={'country-statistics-container'}>
            <NumberFormat
              className={'country-statistics-txt'}
              value={item.recovered}
              displayType={'text'}
              thousandSeparator={true}
            />
            <span className={'country-statistics-label-txt'}>RECOVERED</span>
          </div>
        </div>
      </div>
    )
  }

  searchCountry = (event) => {
    let keyword = event.target.value;
    const newData = this.filter_statistics.filter(item => {
      const itemData = `${item.country.toUpperCase()}`;
      const textData = keyword.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      isLoading: true,
      statistics: newData
    });
  }

  renderStatistics = () => {
    var data = JSON.parse(JSON.stringify(this.props.statistics)).results;
    if (data !== undefined) {
      var totalConfirmed = data.total_confirmed;
      var totalDeaths = data.total_deaths;
      var totalRecovered = data.total_recovered;
      var date = data.last_date_updated;

      var statistics = data.country_statistics;
      if (statistics !== undefined && !this.state.isLoading) {
        this.filter_statistics = statistics;
        this.setState({
          isLoading: true,
          statistics: statistics
        })
      }

      return (
        <div className={'list-container'}>
          <div className={'header-container'}>
            <div className={'covid-label-container'}>
              <p className={'covid-label'}>Coronavirus (COVID-19) Tracker</p>
              <p className={'covid-desc-txt'}>
                Coronavirus (COVID-19) which is an infectious disease caused by respiratory illness and symptoms like flu, cough, fever, difficulty breathing, on December 31, 2019, the first case was recorded in Wuhan, China and later the virus got spread around the world and as of now around&nbsp;
                <NumberFormat
                  className={'total-confirmed-count'}
                  value={totalConfirmed}
                  displayType={'text'}
                  thousandSeparator={true}
                />&nbsp;confirmed cases are being recorded since then.
              </p>
              <p className={'covid-desc-txt'}>
                To get up to date results, this website collects the data from&nbsp;<a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer" className={'covid-desc-link-txt'}>Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).</a>
              </p>
              <p className={'covid-desc-txt'}>
                If you want to know more about the development of this website then visit <a href="https://hackbotone.com/blog/covid-19-full-stack-application" target="_blank" rel="noopener noreferrer" className={'covid-desc-link-txt'}>Coronavirus (COVID-19) - Full Stack Application.</a>
              </p>
            </div>
            <div className={'covid-date-container'}>
              <span className={'covid-timeline-label'}>Last Updated:</span>
              <span className={'covid-timeline'}>{date}</span>
            </div>
            <div className={'total-statistics-container'}>
              <div className={'total-death-recovery-container'}>
                <div className={'dr-container'}>
                  <NumberFormat
                    className={'total-confirmed-count'}
                    value={totalConfirmed}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <span className={'dr-confirmed-label'}>CONFIRMED</span>
                </div>
                <div className={'dr-container'}>
                  <NumberFormat
                    className={'total-deaths-count'}
                    value={totalDeaths}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <span className={'dr-deaths-label'}>DEATHS</span>
                </div>
                <div className={'dr-container'}>
                  <NumberFormat
                    className={'total-recovered-count'}
                    value={totalRecovered}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <span className={'dr-recovered-label'}>RECOVERED</span>
                </div>
              </div>
            </div>
          </div>
          <div className={'header-bottom-line'}></div>
          <div className={'search-container'}>
            <div className={'search-input-border'}>
              <img src={"https://assets.hackbotone.com/images/icons/ic_search.png"} alt="Search" className={'search-icon'}/>
              <input type="text" className={'search-input-text'} placeholder="Search country" onChange={(e) => this.searchCountry(e)} />
            </div>
          </div>
          <div className={'counrty-statistics-list-container'}>
            {this.state.isLoading && this.state.statistics && this.state.statistics.length > 0 ?
              <FlatList
                list={this.state.statistics}
                renderItem={this.renderItem}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
              :
              <div className={!this.state.isLoading ? 'progress-loading-container' : 'progress-loading-container-hide'}>
                <OrbitSpinner
                  color="black"
                  size={60} />
                <p className={'please-wait-text'}>Please wait...</p>
              </div>
            }
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className={'corona-parent-container'}>
        <div className={'header-menu-container'}>
          <a href="https://hackbotone.com/blog/covid-19-full-stack-application" target="_blank" rel="noopener noreferrer" className={'header-label'}>Blog</a>
          <a href="https://github.com/anshumanpattnaik/covid19-full-stack-application" target="_blank" rel="noopener noreferrer" className={'header-label'}>Get the code</a>
          <span className={'header-label'} onClick={this.onSetAboutModal.bind(this, true)}>About</span>
        </div>
        {this.state.isAboutModal ?
          <div className={'about-parent-container'}>
            <div className={'about-overlay-container'} onClick={this.onSetAboutModal.bind(this, false)}></div>
            <div className={'about-modal-container'}>
              <div className={'about-modal-header'}>
                <p className={'about-modal-label'}>About</p>
                <img src={"https://assets.hackbotone.com/images/icons/ic_close.png"} className={'about-modal-close-icon'} alt="Close" onClick={this.onSetAboutModal.bind(this, false)} />
              </div>
              <div className={'about-modal-desc-container'}>
                <p className={'about-modal-description'}>
                  The idea behind this application is to displays the statistics of Coronavirus COVID-19 around the world and the data are being collected from&nbsp;
                    <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer" className={'about-modal-link'}>Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)</a>&nbsp;
                  and it updates the cases constantly on this website around the world.
                </p>
                <p className={'about-modal-description'}>
                  If you don't find any of the cases are not reflecting on this website then also you can visit the&nbsp;
                    <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports" target="_blank" rel="noopener noreferrer" className={'about-modal-link'}>World Health Organization site.</a>
                </p>
              </div>
              <p className={'developer-info-label'}>Website Design & Developed by</p>
              <div className={'developer-info-container'}>
                <div className={'developer-profile-container'}>
                  <a href="https://hackbotone.com/about" target="_blank" rel="noopener noreferrer">
                    <img src="https://assets.hackbotone.com/images/icons/anshuman_pattnaik.jpg" alt="Anshuman Pattnaik" className={'developer-profile-img'} />
                  </a>
                </div>
                <div className={'developer-name-container'}>
                  <a href="https://hackbotone.com/about" target="_blank" rel="noopener noreferrer" className={'developer-name'}>Anshuman Pattnaik</a>
                  <a href="https://hackbotone.com/" target="_blank" rel="noopener noreferrer" className={'developer-website'}>www.hackbotone.com</a>
                </div>
              </div>
            </div>
          </div>
          : null}
        <div className={this.state.isAboutModal && !this.state.matches?'tooltip-container-hide':'tooltip-container'}>
          <img src={"https://assets.hackbotone.com/images/icons/ic_dark_map_style.PNG"} className={'map-style-dark-img'} alt="Dark Theme" onClick={this.onSetMapStyle.bind(this, 'mapbox://styles/hackbotone/ck8vtayrp0x5f1io3sakcmpnv')} />
          <img src={"https://assets.hackbotone.com/images/icons/ic_light_map_style.PNG"} className={'map-style-light-img'} alt="Light Theme" onClick={this.onSetMapStyle.bind(this, 'mapbox://styles/hackbotone/ck8vt8vdj2fz91ilax6nwtins')} />
        </div>
        <div className={this.state.tabSelectedtPos === 1 || this.state.tabSelectedtPos === 3 ? 'map-box-container-hide' : 'map-box-container'}></div>
        <div className={this.state.tabSelectedtPos === 2 || this.state.tabSelectedtPos === 3 ? 'parent-container-hide' : 'parent-container'}>
          {this.renderStatistics()}
        </div>
        <div className={'bottom-tab-menu-container'}>
          <div className={this.state.tabMenuSelect === 1 ? 'total-cases-selected-tab-menu-container' : 'total-cases-tab-menu-container'} onClick={this.onTabSelection.bind(this, 1)}>
            <img src={this.state.tabMenuSelect === 1 ? "https://assets.hackbotone.com/images/icons/ic_selected_list.svg" : "https://assets.hackbotone.com/images/icons/ic_list.svg"} alt="Total Cases" className={'total-cases-icon'} />
            <span className={this.state.tabMenuSelect === 1 ? 'total-cases-selected-label' : 'total-cases-label'}>Total Cases</span>
          </div>
          <div className={this.state.tabMenuSelect === 2 ? 'map-selected-tab-menu-container' : 'map-tab-menu-container'} onClick={this.onTabSelection.bind(this, 2)}>
            <img src={this.state.tabMenuSelect === 2 ? "https://assets.hackbotone.com/images/icons/ic_selected_map.svg" : "https://assets.hackbotone.com/images/icons/ic_map.svg"} alt="Map" className={'map-icon'} />
            <span className={this.state.tabMenuSelect === 2 ? 'map-selected-label' : 'map-label'}>Map</span>
          </div>
          <div className={this.state.tabMenuSelect === 3 ? 'about-selected-tab-menu-container' : 'about-tab-menu-container'} onClick={this.onTabSelection.bind(this, 3)}>
            <img src={this.state.tabMenuSelect === 3 ? "https://assets.hackbotone.com/images/icons/ic_selected_info.svg" : "https://assets.hackbotone.com/images/icons/ic_info.svg"} alt="About" className={'about-icon'} />
            <span className={this.state.tabMenuSelect === 3 ? 'about-selected-label' : 'about-label'}>About</span>
          </div>
        </div>
      </div>
    );
  }
}

const stateProps = state => ({
  statistics: state.statistics
});

const dispatchProps = dispatch => ({
  fetchCoronaStatistics: () => dispatch(fetchCoronaStatistics()),
  showCountryStatistics: item => dispatch(showCountryStatistics(item)),
  setMapStyle: style => dispatch(setMapStyle(style)),
  setAction: action => dispatch(setAction(action))
});

export default connect(stateProps, dispatchProps)(CoronaStatisticsContainer);
