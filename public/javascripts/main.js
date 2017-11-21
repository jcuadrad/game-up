function startMainMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const user_location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
  
          // Center map with user location
          map.setCenter(user_location);
          map.setZoom(15);
        },
        function() {
          console.log("Error in the geolocation service.");
        }
      );
    } else {
      console.log("Browser does not support geolocation.");
    }
  }
  
  startMainMap();