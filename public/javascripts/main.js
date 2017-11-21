function startMainMap () {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

          // Center map with user location
        map.setCenter(userLocation);
        map.setZoom(15);
      },
      function () {
        console.log('Error in the geolocation service.');
      }
    );
  } else {
    console.log('Browser does not support geolocation.');
  }
  axios.get('/games/json').then(response => {
    const allGames = response.data;

    let markers = [];
    allGames.forEach(function (game) {
      let title = game.name;
      let position = {
        lat: game.location.coordinates[0],
        lng: game.location.coordinates[1]
      };
      let pin = new google.maps.Marker({
        position: position,
        map: map,
        title: title
      });
      pin.setIcon(({
        url: 'https://pre00.deviantart.net/47d2/th/pre/i/2017/115/a/6/rick_and_morty_png_by_lalingla-db72d4x.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(100, 100)
      }));
      markers.push(pin);
      console.log(pin.position.lat());
      console.log(pin.position.lng());
    });
  });
};

startMainMap();
