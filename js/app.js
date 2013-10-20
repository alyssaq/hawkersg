var staticMarkers = [], staticInfoWins = [], openInfoObjIdx = null;

var openWin = function(map, infoWin, marker, i) {
  return function(e) {
    if (openInfoObjIdx) staticInfoWins[openInfoObjIdx].close();
    infoWin.open(map, marker);
    openInfoObjIdx = i;
  }
}  

function plotHawkerPlaces(map) {
  var locations = app.Locations;

  for (var i = 0; i < locations.length; i++) {
    var m = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map
    });
    var contentStr = 
      '<div id="bodyContent">'+
      '<b>' + locations[i].place_name + '</b>' +
      '<br>' +
      'Navigate: <br>' +
      '<button type="button" class="btn">From here</button> &nbsp;' +
      '<button type="button" class="btn">To here</button>' +
      '<br>' +
      '</div>';
    var w = new google.maps.InfoWindow({
        content: contentStr,
        maxWidth: 200
    });
    staticMarkers.push(m);
    staticInfoWins.push(w);
  }

  for (var j = 0; j < staticMarkers.length; j++) {
    var openFunc = openWin(map, staticInfoWins[j], staticMarkers[j], j);
    google.maps.event.addListener(staticMarkers[j], 'click', openFunc);
  }
}

function initialize() {
  var leftPos = google.maps.ControlPosition.LEFT_CENTER,
    map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControlOptions:   { position: leftPos },
    zoomControlOptions:  { position: leftPos },
    scaleControlOptions: { position: leftPos }
  });
  var directionsDisplay = new google.maps.DirectionsRenderer(); //{draggable:true}
  var directionsService = new google.maps.DirectionsService();

  map.fitBounds(new google.maps.LatLngBounds( //Singapore bounds
    new google.maps.LatLng(1.300395,103.629227),
    new google.maps.LatLng(1.445922,103.977646)
  ));
  directionsDisplay.setMap(map);
  plotHawkerPlaces(map); 

  var infowindow = new google.maps.InfoWindow(),
    marker = new google.maps.Marker({ map: map }),
    isValid = {origin: false, destination: false},
    addresses = {origin: '', destination: ''};

  var findAddress = function(gmapAutocomplete, oriDest) {
    //resets when a new place is selected
    infowindow.close();
    marker.setVisible(false);

    var place = gmapAutocomplete.getPlace(),
      addr = '';
    if (!place.geometry) {
      document.getElementById("box").innerHTML = oriDest + " location not found";
      isValid[oriDest]   = false;
      return;
    }

    if (place.address_components) {
      var parts = place.address_components, addr = [];
      for (var i = 0; i < parts.length; i = i + 1) {
        addr.push(parts[i] && parts[i].short_name || '');
      }
      addr = place.formatted_address;//addr.join(', ');
      isValid[oriDest]   = true;
      var geom = [null, null], loc = place.geometry.location, i=0;
      for (var o in loc) {
        if (loc.hasOwnProperty(o)) {
          geom[i] = loc[o];
          i = i + 1;
        }
      }
      addresses[oriDest] = new google.maps.LatLng(geom[0], geom[1]);
    }

    if (isValid['origin'] && isValid['destination']) {
      calcRoute();
    } else {
      //If place has a geometry and route and yet plottable, then present it on the map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        console.log('geometry is not within viewport');
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + addr);
      infowindow.open(map, marker);
    }
  }

  var autocompleteAndFindPlace = function(oriDest) {
    var input = (document.getElementById(oriDest));
    var autocomplete = new google.maps.places.Autocomplete(input, 
      { componentRestrictions: {country: 'sg'} }
    );
    autocomplete.bindTo('bounds', map);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      findAddress(autocomplete, oriDest);
    })
  }

  autocompleteAndFindPlace('origin');
  autocompleteAndFindPlace('destination');

//Recalculate distance after dragging
  function calcRoute() {
    var request = {
        origin:      addresses['origin'],
        destination: addresses['destination'],
        travelMode:  google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        document.getElementById("box").innerHTML = "Approx walking distance: " + response.routes[0].legs[0].distance.text
                                                  + ", duration: " + response.routes[0].legs[0].duration.text;
      } else {
        document.getElementById("box").innerHTML = "Could not plot route. Please try different locations";
      }
    });
  }
}

google.maps.visualRefresh = true;
google.maps.event.addDomListener(window, 'load', initialize);
