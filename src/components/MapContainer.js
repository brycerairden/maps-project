import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import MapError from './MapError';


const mapStyles = { width: '100%', height: '100%' },
API_MAPS = 'AIzaSyDEcY5vWUNc2VHlELqkRiB4XhUah2AYYl0',
CLIENT_ID = 'LFRG3KVSHW353K13FXFKQZ1LKUGLYBYCG4EPOHFCOO4UV0G5',
CLIENT_SECRET = 'FWUWLNPZW52VYVXZA5ZZN4OZAOR2CKGLU13HUCMGQHB1TTDW';

class MapContainer extends Component {

  state = {
    map: null,
    activeMarker: {},
    activeLocation: {},
    activeMarkerProps: {},
    markers: [],
    markerProps: [],
    showingInfoWindow: false,
  };

  mapReady = (props, map) => {
    this.setState({map});
    this.updateMarkers(this.props.locations);
  }

  closeInfoWindow = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      activeMarkerProps: {}
    });
  };

  // Match the names of the parks against the Foursquare data
  parksMatch = (props, data) => {
    let parkMatch = data.response.venues.filter(park => park.name.includes(props.name) || props.name.includes(park.name));
    return parkMatch;
  }

  componentWillReceiveProps = (props) => {
    //When receiving props, check if the numbers of markers has changed and update the map appropriately
    if (this.state.markers.length !== props.locations.length) {
      this.closeInfoWindow();
      this.updateMarkers(props.locations);
      return;
    }
    // Check if there is a Selected Index from the list view to highlight on the map
    if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
      return;
    };
    // Treat the List View click just like you would for clicking on the map icon to select the appropriate location
    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
  }

  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

    let activeMarkerProps;
    // Make a call to Foursquare for all places within 50m of the latitude and longitude recorded in the Parks.json file
    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&radius=50&llAcc=50&ll=${props.position.lat},${props.position.lng}`, {
      method: 'GET'
    })
      // Prepare response for parsing as json
      .then(response => response.json())
      .then(result => {
          let pMatch = this.parksMatch(props, result);
          // Add the matched property as a value to the activeMarkerProps object
          activeMarkerProps = {
            ...props,
            fs: pMatch[0]
          };
          console.log('pass')
          // If the activeMarkerProps was changed from null to a value, then use the id within the file to make a request against the Likes endpoint on Foursquare
          if (activeMarkerProps.fs) {
            fetch(`https://api.foursquare.com/v2/venues/${pMatch[0].id}/likes?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`, {
              method: 'GET'
            })
              // Prepare response for parsing as json
              .then(response => response.json())
              // Take the likes response and add the like.summary value to the activeMarkerProps object
              .then(result => {
                activeMarkerProps = {
                  ...activeMarkerProps,
                  like: result.response.likes.summary
                };
                // If info is found, pull up the info window for that specific item, set that marker to active, and hand over the props for it
                this.setState({
                  showingInfoWindow: true,
                  activeMarker: marker,
                  activeMarkerProps
                });
              })
          } else {
              this.setState({
                showingInfoWindow: true,
                activeMarker: marker,
                activeMarkerProps
              });
          }
        })
        .catch(function() {
          console.log('Fetch Request error')
          alert('There was an issue with getting the Foursquare data. Please try again later')
  });

  }

  updateMarkers = (locations) => {
    if (!locations)
      return;

    // remove all markers from the map
    this.state.markers.forEach(marker => marker.setMap(null));

    let markerProps = [];
    // map through all the new markers and assign them properties
    let markers = locations.map((location, index) => {
      let mProps = {
        key: index,
        index,
        name: location.name,
        position: location.pos,
        url: location.url
      };
      markerProps.push(mProps);

      let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
      });
      marker.addListener('click', () => {
        this.onMarkerClick(mProps, marker, null);
      });
      return marker;
    })

    this.setState({ markers, markerProps });
  }

  render() {
    const centerPosition = { lat: 39.572790, lng: -104.868970 },
    { activeMarkerProps, activeMarker, showingInfoWindow } = this.state;

    return (
      <Map
        role='application'
        aria-label='map'
        onReady={this.mapReady}
        google={this.props.google}
        zoom={13}
        style={mapStyles}
        initialCenter={centerPosition}
        onClick={this.closeInfoWindow}
      >
        {this.props.locations.map(location => (
          <Marker
            key={location.id}
            tabindex={location.index}
            title={location.name}
            name={location.name}
            url={location.url}
            position={location.pos}
            onClick={this.onMarkerClick}
          />
        ))}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
        >
          <div className="location-info">
            <h1>{activeMarkerProps.name}</h1>
            {activeMarkerProps && activeMarkerProps.url ? ( <h3><a href={activeMarkerProps.url}>{activeMarkerProps.url}</a></h3> ) : "" }
            {activeMarkerProps && activeMarkerProps.like ? ( <div>This park has {activeMarkerProps.like}.</div> ) : "Error: Could not pull Foursquare Data" }
          </div>
        </InfoWindow>
      </Map>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: API_MAPS,
  LoadingContainer: MapError
})(MapContainer);