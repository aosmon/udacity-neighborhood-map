import React, {Component} from 'react'

let markers = [];

class Map extends Component {

state = {
  mapError: false
}

  componentDidMount() {   
    let self = this;

    const {venues, addMarkers, getInfo, selectVenue} = this.props;
    let {mapError} = this.state;
      
    loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyB9fNq9GDTrseLddWuSLl2xS44uReyBH7k", function() {
      
      window.gm_authFailure = function() {
        alert('Unable to load Google Maps. To get a valid Google Maps API key, visit https://developers.google.com/maps/documentation/javascript/get-api-key')
      }

      if(!mapError) {
        self.map = new window.google.maps.Map(self.refs.map, { center: {lat: 41.8986, lng: 12.4769},  zoom: 13 });
        self.infowindow = new window.google.maps.InfoWindow({
          content: "",
          maxWidth: 270
        });
        self.bounds = new window.google.maps.LatLngBounds();

        venues.map((venue)=>{
          const marker = new window.google.maps.Marker({
            position: venue.latlng,
            title: venue.name,
            map: self.map,
            animation: window.google.maps.Animation.DROP}
          );
          marker.addListener('click', function(){
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(function(){marker.setAnimation(null);}, 1000);
            selectVenue(marker);
            getInfo(marker, self.infowindow, self.map)
          });
          self.bounds.extend(marker.position);
          self.map.fitBounds(self.bounds);
          self.map.panToBounds(self.bounds);
          markers.push(marker);
          return marker;
        })
        addMarkers(markers);
      }
    }, this.onMapError)
  }

  onMapError = () => {
    this.setState(()=>({
      mapError: true,
    }))    
  }

  componentDidUpdate() {
    let self = this;

    const {query} = this.props;
    //Show only markers that match search
    if(query !== ''){
      markers.forEach((marker)=>{marker.setMap(null)});
      markers.filter((m) => (
        m.title.toLowerCase().includes(query.toLowerCase())
      )).map((m)=>(m.setMap(self.map)))  
    }else{
      markers.forEach((marker)=>{marker.setMap(self.map)});
    }
  }

	render(){
    const {sidebarVisible} = this.props;
		return(
			<section className={sidebarVisible?'map-container sidebar-open': 'map-container'}>
				<div ref="map" id="map" role="application">
          {this.state.mapError && (
            <div className="map-error" role="alert">
              'Unable to load Google Maps. Please try again later.'
            </div>
          )}
				</div>
			</section>
      		
		)
	}
}

function loadScript(url, callback, onError)
{
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // Bind events to the callback function
    script.onreadystatechange = callback;
    script.onload = callback;
    script.onerror = onError;
    script.defer = true;
    script.async = true;
    // Add script tag to the head
    document.getElementsByTagName('head')[0].appendChild(script);
}

export default Map