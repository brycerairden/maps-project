import React, {Component} from 'react';
import Parks from './data/Parks.json';
import MapContainer from './components/MapContainer';
import ParksList from './components/ParksList';

class App extends Component {
  state = {
    lat: 39.572790,
    lng: -104.868970,
    zoom: 13,
    all: Parks,
    filter: null,
    open: false,
    selectedIndex: null
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filter: this.filterParks(this.state.all, "")
    });
  }

  toggleDrawer = () => {
    this.setState({
      selectedIndex: null,
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filter: this.filterParks(this.state.all, query)
    });
  }

  filterParks = (locations, query) => {
    let filteredList = locations.filter(restaurant => restaurant.name.toLowerCase().includes(query.toLowerCase()));
    return filteredList;
  }

  clickList = (index) => {
    this.setState({
      selectedIndex: index,
      open: !this.state.open
    })
  }

  styles = {
    parksList: {
      position: "absolute",
      marginTop: "-45px",
      backgroundColor: "green"
    },
    h2style: {
      paddingLeft: "90px",
      fontFamily: "sans-serif",
    }
  }

  render() {
    const { lat, lng, zoom, filter, selectedIndex, open } = this.state;

    return (
      <div className="App">
        <div>
          <h2 style={this.styles.h2style}>Centennial, CO Parks</h2>
          <button onClick={this.toggleDrawer} style={this.styles.parksList}>Parks List</button>
        </div>
        <MapContainer
          lat={lat}
          lng={lng}
          zoom={zoom}
          locations={filter}
          selectedIndex={selectedIndex}
          clickList={this.clickList}
        />
        <ParksList
          open={open}
          toggleDrawer={this.toggleDrawer}
          locations={filter}
          filterLocations={this.updateQuery}
          clickList={this.clickList}
        />
      </div>
    );
  }
}

export default App;