var ctrl = this;
var map, infoWindow;
// initMap Google map based on predefined cairo position
function initMap() {
  "use strict";
  // set default map values
  var mapOptions = {
  center: new google.maps.LatLng(30.060668, 31.219883), // the initial location of cairo on map lat and lng
  zoom: 12, // the initial zoom to display area 
  mapTypeId: google.maps.MapTypeId.ROADMAP // type of map ROADMAP (normal, default 2D map)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); // set default values to map that will load in map-canvas
  infoWindow = new google.maps.InfoWindow();
  ko.applyBindings(new appViewModel());
}
function googleError() {
  alert("error");
}
//Knockout Model
// List of my favorite places in cairo
var Model = [{
    "name": "Burger Factory", //the name of place
    "latlng": [30.059875598754438, 31.221953590277508] //the location of place on map using lat and lng 
  },
  {
    "name": "Left Bank", //the name of place
    "latlng": [30.073034918695033, 31.221981542482556] //the location of place on map using lat and lng
  },
  {
    "name": "Pottery Cafe", //the name of place
    "latlng": [30.064569817454906, 31.215708902077974] //the location of place on map using lat and lng
  },
  {
    "name": "The Coffee Bean & Tea Leaf", //the name of place
    "latlng": [30.064377087896453, 31.215763092041016] //the location of place on map using lat and lng
  },
  {
    "name": "Diwan Bookstore", //the name of place
    "latlng": [30.05925140815715, 31.224002838134766] //the location of place on map using lat and lng
  }
];



//Knockout ViewModel
var appViewModel = function() {
  var ctrl = this; // use this variable to define this scope only 
  ctrl.markers = ko.observableArray([]); // defined that as array using observable
  ctrl.allLocations = ko.observableArray([]); // defined that as array using  observabl
  ctrl.filter = ko.observable(''); // defined that as sting using  observabl
  ctrl.search = ko.observable(''); // defined that as sting using  observabl
  // call initMap function before start inject points on map to make sure the map is loaded  
  // if google map is not displaying, alert the user
  if (!map) {
    alert("Currently Google Maps is not available. Please try again later!");
    return;
  }
  // if map loaded define map variable that use in this scope only 
  ctrl.map = ko.observable(map);
  //  call fetchForsquare function and set parameters of allocations array,
  //  markers array and data that returned from call map function
  fetchForsquare(ctrl.allLocations, ctrl.map(), ctrl.markers);
  // Based on the search keywords filter the list view
  // we use computed where computed observables come in these are functions that are dependent on one or more other observables 
  // to  use it here to return filter results  
  ctrl.filteredArray = ko.computed(function() {
    return ko.utils.arrayFilter(ctrl.allLocations(), function(item) { // loop on all in allLocations using each item 
      if (item.name.toLowerCase().indexOf(ctrl.filter().toLowerCase()) !== -1) { // parse name in item to lower case and check it if contain same user words enter 
        if (item.marker)
          item.marker.setMap(map); //if compare return result call marker and show it only on map
      } else {
        if (item.marker)
          item.marker.setMap(null); // otherwise return null
      }
      return item.name.toLowerCase().indexOf(ctrl.filter().toLowerCase()) !== -1;
    });
  }, ctrl);
  // call this function when user click on point to toggal data 
  // here click listener within this scope
  ctrl.clickHandler = function(data) {
    centerLocation(data, ctrl.map(), ctrl.markers); // call centerLocation fumction and pass last value of map and markers that with data send from click dom
    infoWindow.setContent(data.marker.content);
    infoWindow.open(ctrl.map(), data.marker);
  };
  // get location data from foursquare
  function fetchForsquare(allLocations, map, markers) {
    var locDataArr = [];
    var foursquareUrl = "";
    var location = [];
    // loop on all places in Model
    Model.forEach(function(place) {
      // call foursquare api using client_id and client_secret that created with application on foursquare.com
      foursquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=SSBJKZOCGBBHJBILKTNSUU20WMNZHY3MEIMY3XWE3TETY1JY&client_secret=D24W3VAHVLYU34WYD3ZUEDNUKVFZDIOO1UVFWRGIANKNF4S5&v=20130815&m=foursquare&ll=' + place.latlng[0] + ',' + place.latlng[1] + '&query=' + place.name + '&intent=match';
      // send http request using get method that return json 
      $.getJSON(foursquareUrl,function(data){
        if (data.response.venues) { //check if return data
          var item = data.response.venues[0]; // place info will return on venues[0]
          allLocations.push(item); //push places in allLocations array
          // craete new object that contain all info of palce
          var postalCode;
          if (item.location.postalCode) {
            postalCode = item.location.postalCode;
          } else {
            postalCode = " ";
          }     
          location = { 
            lat: item.location.lat, 
            lng: item.location.lng, 
            name: item.name, 
            loc: item.location.address + " " + item.location.city + ", " + item.location.state + " " + postalCode 
          };
          //location = { lat: item.location.lat, lng: item.location.lng, name: item.name, loc: item.location.address + " " + item.location.city + ", " + item.location.state + " " + item.location.postalCode };
          locDataArr.push(location); //set all info in locDataArr array
          placeMarkers(allLocations, place, location, map, markers); // call placeMarkers to display points on map
        }
      }).fail(function(data){
        alert("Something went wrong, Could not retreive data from foursquare. Please try again!");
        console.log(data);
      });
    });
  }
  // place marker for the result locations on the map
  function placeMarkers(allLocations, place, data, map, markers) {
    var latlng = new google.maps.LatLng(data.lat, data.lng); //set lat and lng in google.maps object
    var marker = new google.maps.Marker({ // set value of point 
      position: latlng, // position of point 
      map: map, // to overwrite on last points on map
      animation: google.maps.Animation.DROP, // set point animation 
      content: data.name + "<br>" + data.loc // print name and location on tip toggal`
    });
    // create infoWindow for each marker on the map
    var infoWindow = new google.maps.InfoWindow({
      content: marker.content //set marker info
    });
    marker.infowindow = infoWindow;
    markers.push(marker); // push marker info in markers array 
    allLocations()[allLocations().length - 1].marker = marker; // set last index value in allLocations that have marker equal marker
    // show details info about location when user clicks on a marker
    google.maps.event.addListener(marker, 'click', function() {
      // close the open infowindow
      for (var i = 0; i < markers().length; i++) {
        markers()[i].infowindow.close();
      }
      // open this infowindow
      infoWindow.open(map, marker);
    });
    // toggle bounce when user clicks on a location marker on google map
    google.maps.event.addListener(marker, 'click', function() {
      toggleBounce(marker); //call toggleBounce using marker data
    });
  }
  // Add bounce to a marker
  function toggleBounce(marker) {
    // Google map documentation shows to keep one
    if (marker.getAnimation() !== null) { // check have animation 
      marker.setAnimation(null); // set animation to null
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE); // set animation to BOUNCE
      //after 600ms set animation to null again 
      setTimeout(function() {
        marker.setAnimation(null);
      }, 600);
    }
  }
  // clickHandler on location list view
  function centerLocation(data, map, markers) {
    // close the open infowindow  
    for (var i = 0; i < markers().length; i++) {
      markers()[i].infowindow.close();
    }
    // set lat and lng on map using location to focus on it
    map.setCenter(new google.maps.LatLng(data.location.lat, data.location.lng));
    // set zoom to 12 again
    map.setZoom(12);
    // loop on all markers and compare it with data.name
    for (i = 0; i < markers().length; i++) {
      var content = markers()[i].content.split('<br>');
      if (data.name === content[0]) {
        // toggal it if comper return true
        toggleBounce(markers()[i]);
      }
    }
  }  
};
// Activates knockout.js
// bind ViewModel in dom
