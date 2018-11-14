import React, {Component} from 'react'

class MapError extends Component {
  state = {
    show: false,
    timeout: null
  }
  //wait .8 seconds for Google to respond
  componentDidMount = () => {
    let timeout = window.setTimeout(this.showError, 800);
    this.setState({timeout});
  }

  // Show error function
  showError = () => {
    this.setState({show: true})
  }

  render() {
    return (
      <div>
        {this.state.show ? (<div><h1>Uh Oh...</h1><p>Well this is embarrassing. It seems there was an issue with getting the map. Please try again later.</p></div>) : (<div><h1>Getting The Google Maps</h1></div>)}
      </div>
    )
  }

}

export default MapError;