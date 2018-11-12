import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import MapError from './MapError';


const mapStyles = { width: '100%', height: '100%' },
API_MAPS = 'AIzaSyDEcY5vWUNc2VHlELqkRiB4XhUah2AYYl0',
FS_CLIENT = 'LFRG3KVSHW353K13FXFKQZ1LKUGLYBYCG4EPOHFCOO4UV0G5',
FS_SECRET = 'FWUWLNPZW52VYVXZA5ZZN4OZAOR2CKGLU13HUCMGQHB1TTDW',
FS_VERSION = '20180323';

class MapContainer extends Component {

  state = {
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

  parksMatch = (props, data) => {
    let parkMatch = data.response.venues.filter(restaurant => restaurant.name.includes(props.name) || props.name.includes(restaurant.name));
    return parkMatch;
  }

  componentWillReceiveProps = (props) => {
    if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
      return;
    };
    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
  }


  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION }&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
    let headers = new Headers();
    let request = new Request(url, {
        method: 'GET',
        headers
    });

    let activeMarkerProps;
    fetch(request)
      .then(response => response.json())
      .then(result => {
          let pMatch = this.parksMatch(props, result);
          activeMarkerProps = {
            ...props,
            fs: pMatch[0]
          };
          console.log('pass')

          if (activeMarkerProps.fs) {
            let url = `https://api.foursquare.com/v2/venues/${pMatch[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION }`;
            fetch(url)
              .then(response => response.json())
              .then(result => {
                activeMarkerProps = {
                  ...activeMarkerProps,
                  images: result.response.photos
                };
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
          console.log('Fetch Request error');
  });

  }

  updateMarkers = (locations) => {
    if (!locations)
      return;
    this.state.markers.forEach(marker => marker.setMap(null));

    let markerProps = [];
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
            {activeMarkerProps && activeMarkerProps.images ? ( <div><img alt = {"Picture of " + activeMarkerProps.name} src={activeMarkerProps.images.items[0].prefix + "100x100" + activeMarkerProps.images.items[0].suffix }/></div> ) : "" }
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