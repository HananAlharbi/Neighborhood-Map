var map, infowwindow;
var markers =[];
var dynamicMarkers = [];

var locations = [
  {title:'Starbucks' ,location: {lat:24.783349,lng:46.729692}},
  {title:'Shake Shack' ,location: {lat:24.704123,lng:46.693148}},
  {title:'Urth Cafe' ,location: {lat:24.705812,lng:46.705732}},
  {title:'KFC1' ,location: {lat:24.756059,lng:46.639722}},
  {title:'KFC2' ,location: {lat:24.746059,lng:46.619722}},
  {title:'Carter'  ,location: {lat:24.743673,lng:46.658264}},
  {title:'Java Time'  ,location: {lat:24.713786,lng:46.675296}}
];

function googleError() {
  alert("The Google Maps API has failed. Please try again.");
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(24.782661, 46.629109),
    zoom:12,
    mapTypeId: google.maps.MapTypeId.ROADMAP

  });

  // Createing Infowindow
  infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  for (i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var lat   = locations[i].location.lat;
    var lng   = locations[i].location.lng;
    var title = locations[i].title;

    // create marker
    marker = new google.maps.Marker({
      map: map ,
      draggable: true,
      position: position,
      lat:lat,
      lng:lng,
      title:title,
      animation:google.maps.Animation.DROP,
    });

    //when clicked on marker show information
    marker.addListener('click', toggleBounce);
    marker.addListener('click', openInfoWindow);
    bounds.extend(marker.position);
    markers.push(marker);
  }

  function toggleBounce() {
    var self = this
    self.setAnimation(google.maps.Animation.BOUNCE)
    for (var i = 0; i < markers.length; i++) {
      if (self !== markers[i]) {
        markers[i].setAnimation(null)
      }
    }
  }

  function openInfoWindow() {
    populateInfoWindow(this, infowindow)
  }

  function populateInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      var phone, address, name;
      var apiURL = 'https://api.foursquare.com/v2/venues/';
      var foursquareClientID = 'PQOPXJJPRCHKLA12RPQI4GI4BIWCLNEUDZWH04QIVBX32EXR';
      var foursquareSecret = 'K0GHTGPKFD35BIDNSQLJYGPMGEVPCDS3DOZXBVMMZJPNO5QO';
      var venueFoursquareID = "20161016";
      var foursquareURL = apiURL + 'search?v=' + venueFoursquareID + '&ll='+marker.lat+','+marker.lng + '&intent=checkin&' + 'client_id=' + foursquareClientID + '&client_secret=' + foursquareSecret;
      console.log(foursquareURL);
      $.ajax({
        url: foursquareURL,
        success: function(data) {
          phone = data.response.venues[0].contact.phone;
          address = data.response.venues[0].location.address;
          name = data.response.venues[0].name;
          this.phone = ko.observable(phone);
          if (phone === "" || phone === null ||typeof phone == 'undefined') {
            phone = "Not avilable";
          }
          if (address === "" || address === null|| typeof address == 'undefined') {
            address = "Not avilable";
          }
          if (name === "" || name === null|| typeof name == 'undefined' ) {
            name = "Not avilable";
          }
          infowindow.setContent('<div>' + 'Name :' + name + '/' + marker.title + '<br>' + 'PHONE(#) :' + phone + ' Address : ' + address + '</div>');
          infowindow.open(map, marker);

          marker.addListener('closeclick', function() {
            // infowindow.open(map ,marker);

          });
        },
        error: function(error) {
          infowindow.setContent('issue loading from server');
          infowindow.open(map, marker);
          // alert("location details are not available now , please try again.");
        }
      });

    } //END IF

  } //populateInfoWindow

  function model(){
    this.query = ko.observable('');
    this.stopBouncing = function(){
      for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null)
      }
    }

    this.filteredLocations = ko.computed(function(){

      if(this.query().trim() == '') {
        dynamicMarkers = markers
        this.stopBouncing()
        return dynamicMarkers

      } else {
        var regex = new RegExp(this.query().trim(), 'i');

        var newArray = locations.filter(function(loc, index){
          return loc.title.match(regex)
        })

        // Generating a dynamic markers array with matched elements based on title ONLY!
        // TODO: Find a better way to match this list, duplicate titles will cause unexpected results on the map
        // TODO: Find better array methods, this is O(n^2) *BAD*
        dynamicMarkers = []
        for (var n = 0; n < newArray.length; n++) {
          for (var m = 0; m < markers.length; m++) {
            if (newArray[n].title === markers[m].title) {
              dynamicMarkers.push(markers[m])
            }
          }
        }

        // Only bounce what matches with regex
        markers.map(function(mark) {
          if (mark.title.match(regex)) {
            mark.setAnimation(google.maps.Animation.BOUNCE);
          } else {
            mark.setAnimation(null);
          }
        })

        infowindow.close()

        // show all markers that are in the newArray
        return newArray; // return the filtered array
      }
    }, this);

    this.titleClicked = function(data, event){
      // search in markers list where the marker title = loc.title
      // if you find the marker you can use trigger to simulate the marker click

      // 'markid' below is set in index.html as a data-markid attribute to keep track of locations
      google.maps.event.trigger(dynamicMarkers[event.currentTarget.dataset.markid], 'click')
    }

  } // model()

  ko.applyBindings(new model())
} //  initMap()


$(document).ready(function () {
  var trigger = $('.hamburger'),
  overlay = $('.overlay'),
  isClosed = false;

  trigger.click(function () {
    hamburger_cross();
  });

  function hamburger_cross() {
    if (isClosed === true) {
      overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      isClosed = false;
    } else {
      overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
  }

  $('[data-toggle="offcanvas"]').click(function () {
    $('#wrapper').toggleClass('toggled');
  });

  setTimeout(function(){
    trigger.trigger( "click" );
  },200);

});
