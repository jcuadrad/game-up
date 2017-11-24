function startMainMap () {
  // --- Create new instance of the main map, and eliminate the default UI controls
  var map = new google.maps.Map(document.getElementById('map'), {
    styles: [
      {
        'featureType': 'administrative',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'lightness': 33
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'all',
        'stylers': [
          {
            'color': '#f2e5d4'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#c5dac6'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'labels',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'lightness': 20
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'all',
        'stylers': [
          {
            'lightness': 20
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#c5c6c6'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#e4d7c6'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#fbfaf7'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'color': '#acbcc9'
          }
        ]
      }
    ],
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
        map.setZoom(14);

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
          url: './images/yourpingameup.png',
          // size: new google.maps.Size(60, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 15),
          scaledSize: new google.maps.Size(30, 30)
        }));

        // Create user radius circle
        var cityCircle = new google.maps.Circle({
          strokeColor: '#1f2526',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#1f2526',
          fillOpacity: 0.15,
          map: map,
          center: userLocation,
          radius: 800
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
      const startTimeFormated = _dateFormated(game.startTime);
      const endTimeFormated = _dateFormated(game.endTime);
      let infoWindowJoin =
      `<div class="game-preview">
      <h1>${title}</h1>
      <h2>${game.sport}</h2>
      <p>Players Needed<br> <strong>${game.playersNeeded}</strong></p>
      <p>Start Time <br> <strong>${startTimeFormated}</strong></p>
      <p>End Time <br> <strong>${endTimeFormated}</strong></p>
      <form action="/game/${game._id}" method="POST">
        <input type="submit" value="Join">
      </form>
      </div>;`;
      let infoWindowCancel =
      `<div class="game-preview">
      <h1>${title}</h1>
      <h2>${game.sport}</h2>
      <p>Players Needed: ${game.playersNeeded}</p>
      <p>Start Time: ${startTimeFormated}</p>
      <p>End Time: ${endTimeFormated}</p>
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
        url: './images/gameuppin.png',
        // size: new google.maps.Size(90, 90),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(30, 40)
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
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

function _dateFormated (date) {
  var arrWithDateAndHour = date.split('T');
  var monthAsText = _getMonth(arrWithDateAndHour[0]);
  var day = _getDay(arrWithDateAndHour[0]);
  var hour = _getHour(arrWithDateAndHour[1]);
  var minutes = _getMinutes(arrWithDateAndHour[1]);

  var dateFormated = `${monthAsText} ${day} ${hour}:${minutes}`;
  console.log(dateFormated);

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

function _getHour (date) {
  return date.split(':')[0];
}

function _getMinutes (date) {
  return date.split(':')[1];
}
