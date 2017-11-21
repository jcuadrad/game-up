function startMainMap () {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  map.addListener('click', function (e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker (position, map) {
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
    map.panTo(position);
  }

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

        var myMarker = new google.maps.Marker({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          map: map,
          title: 'Im here',
          animation: google.maps.Animation.DROP
        });

        myMarker.setIcon(({
          url: 'http://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-circle-dark-icon.png',
          size: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 15),
          scaledSize: new google.maps.Size(30, 30)
        }));

        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.15,
          map: map,
          center: userLocation,
          radius: 300
        });
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
        url: 'https://openclipart.org/image/800px/svg_to_png/195874/ts-map-pin.png',
        size: new google.maps.Size(50, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 70)
      }));
      markers.push(pin);
      console.log(pin.position.lat());
      console.log(pin.position.lng());
    });
  });
};

startMainMap();
