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
  // Show the full list, by using a blank filter
  componentDidMount = () => {
    this.setState({
      filter: this.state.all
    });
  }

  // Toggle the drawer open and close based on going to the opposite of the current state
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

 // Function that matches the names to the query. Uses toUpperCase since includes is case sensitive
  filterParks = (locations, query) => {
    if (query.length > 0) {
      let filteredList = locations.filter(park => park.name.toUpperCase().includes(query.toUpperCase()));
      this.setState({ filter: filteredList });
    } else {
      this.setState({ filter: locations });
    }
  }

  // set the filter equal to the fltered list of parts who's names match the query
  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null
    });
    this.filterParks(this.state.all, query)
  }


  // sets the clicked list item to the selected index so it can be toggled on the map, then closes the location
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