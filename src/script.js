var map, infowwindow;
       function initMap() {
         var map = new google.maps.Map(document.getElementById('map'), {
           center: new google.maps.LatLng(24.782661, 46.629109),
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP

     }

     
     
 );
  function googleError() {
  alert("The Google Maps API has failed. Please try again.");
}

         

      var locations = [
       {title:'Starbucks' ,location: {lat: 24.783349, lng: 46.729692}},
       {title:'Shake Shack' ,location: {lat: 24.704123, lng:46.693148}},
       {title:'Urth Cafe' ,location: {lat: 24.705812, lng:  46.705732}},
       {title:'KFC' ,location: {lat: 24.746059, lng: 46.619722}},
       {title:'Carter'  ,location: {lat: 24.743673, lng: 46.658264}},
       {title:'Five Guys'  ,location: {lat: 24.713786, lng: 46.675296}}
     ];

     var markers =[];
     var marker;


// Createing Infowindow
     infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

      // for (i ; i<locations.length ; i++)
      
    for (i = 0; i < locations.length; i++)
      {
        var position = locations[i].location;
          var title = locations[i].title;

// create marker
           marker = new google.maps.Marker({
                  map: map ,
                  draggable: true,
                  position: position,
                  title:title,
                  animation:google.maps.Animation.DROP,

                  id:i
                });
//when clicked on marker show information
           marker.addListener('click', toggleBounce);

          markers.push(marker);

          bounds.extend(marker.position);
          marker.addListener('click', openInfoWindow);
         // marker.addListener('click',function() {

         // populateInfoWindow(this,infowindow);
     // infowindow.open(map ,marker);
                //     });


    // Add locations in List view
    $(".locations-view").append(' <li data-markid='+i+' class="location"><a href="#">'+ locations[i].title +'</a></li>');
  }


 $(".locations-view .location").click(function(){

   var markid = $(this).data('markid');

   google.maps.event.trigger(markers[markid], 'click');

 });

function openInfoWindow() {
  populateInfoWindow(this,infowindow);
}





function Filter(title, lat, lng) {
    this.title = ko.observable(title);
    this.lat = ko.observable(lat);
    this.lng = ko.observable(lng);
    this.clickMe = function(data, event){
      var target;
      if(event.target) target = event.target;
      else if (event.srcElement)  target = event.srcElement;

      for (var i = 0 ; i< locations.length; i++){
        if (locations[i].title == title ){
          var infowindow = new google.maps.Infowindow();
          var lat = locations[i].location.lat;
          var lng = locations[i].location.lng;
          populateInfoWindow(locations[i].marker,infowindow,lat,lng);
        }
      }
    };


function model() {
    var self = this;
    self.Filter = ko.observableArray("");
    self.query = ko.observable("");
    self.filteredEmployees = ko.computed(function () {
        var filter = self.query().toLowerCase();

        if (!filter) {
            return self.Filter();
        } else {
            return ko.utils.arrayFilter(self.Filter(), function (item) {
                return item.firstName().toLowerCase().indexOf(filter) !== -1;
            });
        }
    });
}


var mymodel = new model();



function loaddata() {
 for (var i =0 ; i<locations.length; i++){
  var lat = locations[i].location.lat;
  var lng = locations[i].location.lng;
  var title = locations[i].location.title;
  mymodel.Filter.push(new location(title,lat,lng));
 }
}


$(document).ready(function () {
    loaddata();
    ko.applyBindings(mymodel);
});


}
//Search
/*
 function search(keyword,SuccessCallBack,ErrorCallBack){

    var  result , status;
   for(i=0;i<locations.length;i++){
      result = locations[i].title.search(keyword);

     if(result >= 0){

       status = true;

       break;
     }
     else{
      status = false;
     }
   }

   if(status === true){
      SuccessCallBack(i);
   }
   else{
     ErrorCallBack(i);
   }
   //return id;
 }


 $("#filter").click(function(){
   var text = $("#keyword").val();

    if(text === ''){
      alert("Please Inter Keyword");
      return;
    }

   search(text,function(i){

    google.maps.event.trigger(markers[i], 'click');
      //console.log(markers[i]);

   },function(){
     alert("Not found");
   });

 });
*/

//My forSq API

function populateInfoWindow(marker, infowindow) {

        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            var phone, address, name;
            var apiURL = 'https://api.foursquare.com/v2/venues/';
            var foursquareClientID = 'PQOPXJJPRCHKLA12RPQI4GI4BIWCLNEUDZWH04QIVBX32EXR';
            var foursquareSecret = 'K0GHTGPKFD35BIDNSQLJYGPMGEVPCDS3DOZXBVMMZJPNO5QO';
            var venueFoursquareID = "20161016";
            var foursquareURL = apiURL + 'search?v=' + venueFoursquareID + '&ll=' + position.lat + ',' + position.lng + '&intent=checkin&' + 'client_id=' + foursquareClientID + '&client_secret=' + foursquareSecret;
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
                    alert("location details are not available now , please try again.");
                }
            });

        } //END IF


    } //populateInfoWindow





/*

populateInfoWindow = function (marker,infowindow) {
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title +'&format=json&callback=wikiCallback';
        var wikiRequestTimeout = setTimeout(function(){
          alert("failed to get wikipedia resources")
        }, 8000);
        var articleStr;
        var contentString = '<h3>' + marker.title + '</h3>' + '<img src="' + marker.image + '" height=\"100px\" width=\"200px\">' + '<br>';
        $.ajax({
          url: marker.url,
          dataType: "jsonp",
          //jsonp : "callback",
          success: function(response) {//response is a javascript object 
            var articleList = response[1];

            for(var i = 0; i < articleList.length; i++) {
              articleStr = articleList[i];
              var url = 'http://en.wikipedia.org/wiki/' + articleStr;
              contentString = contentString + '<a href=\"' + url + '\">' + url + '</a>' + '<br>';
            };
            //clearTimeout(wikiRequestTimeout);
          }
        });

        if (infowindow.marker != marker) {
        infowindow.marker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                marker.setAnimation(null);
            }, 2000);
            infowindow.setContent(contentString);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
              });
          }
      }
      
   */


   function toggleBounce() {

        for(i=0;i<markers.length;i++){
            markers[i].setAnimation(null);
        }

        /*
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
        } else {
          */
          this.setAnimation(google.maps.Animation.BOUNCE);

          /*
           setTimeout(function() {
           this.setAnimation(null);},650 );
           */
        //}
      }

}


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