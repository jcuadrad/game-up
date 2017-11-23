function startMainMap () {
  // --- Create new instance of the main map, and eliminate the default UI controls
  var map = new google.maps.Map(document.getElementById('map'), {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  // --- Set user position

  if (navigator.geolocation) {
    // -- Get position from the browser
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

          // Center map with user location and set default map zoom
        map.setCenter(userLocation);
        map.setZoom(15);

        // Create user marker
        var myMarker = new google.maps.Marker({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          map: map,
          title: 'Im here',
          animation: google.maps.Animation.DROP
        });

        // Set the Icon for the User
        myMarker.setIcon(({
          url: 'http://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-circle-dark-icon.png',
          size: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 15),
          scaledSize: new google.maps.Size(30, 30)
        }));

        // Create user radius circle
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
      });
  } else {
    console.log('Browser does not support geolocation.');
  }

  // Get all the games created from the Database
  axios.get('/games/json').then(response => {
    const allGames = response.data;

    let markers = [];

    // Create a marker for every game
    allGames.forEach(function (game) {
      let title = game.name;
      let participants = game.playersAttending;
      const dateFormated = _formatterDate(game.startTime);
      let infoWindowJoin =
      `<div class="game-preview">
      <h1>${title}</h1>
      <h2>${game.sport}</h2>
      <p>Players Needed: ${game.playersNeeded}</p>
      <p>Start Time: ${dateFormated}</p>
      <p>End Time: ${game.endTime}</p>
      <form action="/game/${game._id}" method="POST">
        <input type="submit" value="Join">
      </form>
      </div>;`;
      let infoWindowCancel =
      `<div class="game-preview">
      <h1>${title}</h1>
      <h2>${game.sport}</h2>
      <p>Players Needed: ${game.playersNeeded}</p>
      <p>Start Time: moment(${game.startTime}</p>
      <p>End Time: ${game.endTime}</p>
      <form action="/game/${game._id}" method="POST">
        <input type="submit" value="Cancel">
      </form>
      </div>;`;

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

      if (participants.includes(userId)) {
        let infowindowCancel = new google.maps.InfoWindow({
          content: infoWindowCancel
        });

        pin.addListener('click', function () {
          infowindowCancel.open(map, pin);
        });
      } else {
        let infowindowJoin = new google.maps.InfoWindow({
          content: infoWindowJoin
        });

        pin.addListener('click', function () {
          infowindowJoin.open(map, pin);
        });
      }
      // console.log(pin.position.lng());
    });
  });
};

startMainMap();

const MONTH = {
  '1': 'January',
  '11': 'November'
};

function _formatterDate (date) {
  var arrWithDateAndHour = date.split('T');
  var monthAsText = _getMonth(arrWithDateAndHour[0]);
  var day = _getDay(arrWithDateAndHour[0]);

  var dateFormated = `${monthAsText} ${day}`;

  return dateFormated;
}

function _getMonth (date) {
  // pre:- format of date AAAA-MM-DD
  var month = date.split('-')[1];
  return MONTH[month];
}

function _getDay (date) {
  // pre:- format of date AAAA-MM-DD
  return date.split('-')[2];
}
