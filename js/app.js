function from(latlong) {
  $("#origin").val(latlong);
}

(function() {
var staticMarkers = [], staticInfoWins = [], openInfoObjIdx = null, isOpen = false;
var menuRight = document.getElementById('cbp-spmenu-s2');
var showRight = document.getElementById('showRight');

var openInfoWin = function(map, infoWin, i) {
  return function(e) {
    closeWin();
    infoWin.open(map, this);
    openInfoObjIdx = i;
    isOpen = true;
    populateHawkerDetails(app.Locations[i]);
  }
}  

function populateHawkerDetails(data) {
  console.log(data);
  var $elem = $('#hawker-details');
  $elem.find('h3').html(data.place_name.split('(')[0]);
  $elem.find('.content').html(data.place_desc)
}

function closeWin() {
  if (openInfoObjIdx) staticInfoWins[openInfoObjIdx].close();
}

var closeInfoWin = function () {
  console.log('close');
}

$('#map-canvas').click(function () {
  if (isOpen) {
    isOpen = false;
    classie.addClass(document.body, 'cbp-spmenu-push-toleft' );
    classie.addClass(menuRight, 'cbp-spmenu-open' );
  } else {
  //  closeWin();
    classie.removeClass(document.body, 'cbp-spmenu-push-toleft' );
    classie.removeClass(menuRight, 'cbp-spmenu-open' );
  }
});

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
      '<button class="btn fromBtn" onclick=from("'+locations[i].lat+ ','+ locations[i].lng + '")>' +
      'From here</button> &nbsp;' +
      '<button class="btn toBtn" onclick="to()">To here</button>' +
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
    var openFunc = openInfoWin(map, staticInfoWins[j], j);
    google.maps.event.addListener(staticMarkers[j], 'click', openFunc);
    google.maps.event.addListener(staticInfoWins[j],'closeclick', closeInfoWin);
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

  map.fitBounds(new google.maps.LatLngBounds( //Singapore bounds
    new google.maps.LatLng(1.300395,103.629227),
    new google.maps.LatLng(1.445922,103.977646)
  ));
  plotHawkerPlaces(map); 
}

google.maps.visualRefresh = true;
google.maps.event.addDomListener(window, 'load', initialize);
})();
