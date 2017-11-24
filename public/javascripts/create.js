function initMap () {
  // Create new instance of Map
  var map = new google.maps.Map(document.getElementById('search-map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  // Get the input to be autocompleted from the DOM
  var input = document.getElementById('searchTextField');

  // Create new instance of Google Places Autocomplete, and connect it to input
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  // Create Marker for when the user chooses a location from autocomplete
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  // Add event listener for when the place in the autocomplete changes
  autocomplete.addListener('place_changed', function () {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert('Autocomplete\'s returned place contains no geometry');
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the Marker Icon
    marker.setIcon(({
      url: './images/gameuppin.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 45)
    }));

    // Place and show the marker in the map
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    // Set the value of Lat and Lng inside hidden inputs in the DOM to retrieve
    document.getElementById('cityLat').value = place.geometry.location.lat();
    document.getElementById('cityLng').value = place.geometry.location.lng();
  });
}

initMap();
