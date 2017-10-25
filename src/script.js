var map, infoWindow;
       function initMap() {
         var map = new google.maps.Map(document.getElementById('map'), {
           center: new google.maps.LatLng(24.782661, 46.629109),
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP

     }
 );

//Error handling
function googleError() {
  alert("There is error");
}

      var locations = [
       {title:'Starbucks' ,location: {lat: 24.783349, lng: 46.729692}},
       {title:'Imam Muhammed University' ,location: {lat: 24.815595, lng: 46.701577}},
       {title:'Jarir Store' ,location: {lat: 24.766366, lng: 46.755773}},
       {title:'King Fahad BookStore' ,location: {lat: 24.685901, lng: 46.686450}},
       {title:'King Saud University'  ,location: {lat: 24.727570, lng: 46.624580}}
     ];

     var markers =[];
     var marker;

     infowindow = new google.maps.InfoWindow();


    var bounds = new google.maps.LatLngBounds();

      // for (i ; i<locations.length ; i++)
      for (i = 0; i < locations.length; i++)
      {
        var position = locations[i].location;
          var title = locations[i].title;


           marker = new google.maps.Marker({
                  map: map ,
                  draggable: true,
                  position: position,
                  title:title,
                  animation:google.maps.Animation.DROP,

                  id:i
                });

           marker.addListener('click', toggleBounce);


          markers.push(marker);

          bounds.extend(marker.position);

          marker.addListener('click',function() {

          populateInfoWindow(this,infowindow);



     // infowindow.open(map ,marker);
                     });

// Add locations in List view
 $(".locations-view").append(' <li data-markid='+i+' class="location"><a href="#">'+ locations[i].title +'</a></li>');
  }

 $(".locations-view .location").click(function(){

   var markid = $(this).data('markid');

   google.maps.event.trigger(markers[markid], 'click');

 });


var apiURL = 'https://api.foursquare.com/v2/venues/';
var foursquareClientID = 'PQOPXJJPRCHKLA12RPQI4GI4BIWCLNEUDZWH04QIVBX32EXR'
var foursquareSecret ='K0GHTGPKFD35BIDNSQLJYGPMGEVPCDS3DOZXBVMMZJPNO5QO';
var foursquareVersion = '20170115';
var venueFoursquareID = "4b4aac62f964a520a98c26e3";

var foursquareURL = apiURL + venueFoursquareID + '?client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;

$.ajax({
  url: foursquareURL,
  success: function(data) {
    console.log(data);
  }
});





function loadingData (){
  for (var i =0 ; i <locations.length; i++){
    var lat = locations[i].location.lat;
    var lng = locations[i].location.lng;
    var title = locations[i].title;
    mymodel.Knockout.push(new Knockout(title, lat, lng));
  }
}


  function Knockout (title, lat, lng){
    this.title = ko.observabl(title);
    this.lat = ko.observabl(lat);
    this.lng = ko.observabl(lng);
    this.click = function (data, event){
      var target;
      if (event.target)
       target = event.target;
      else
        if (event.srcElement)
          target = event.srcElement;

        for( var i=0; i < locations.length; i++){
          if (locations[i].title == title){
            var infowindow = new google.maps.Infowindow();
            var lat = locations[i].location.lat;
            var lng = locationsp[i].location.lng;
          }
        }

    }
  }

 var mymodel = new model();
//$(document).ready(function(){
  //loadingData();
  //ko.applyBindings(mymodel);
//});


//Search function

 //function search(keyword,SuccessCallBack,ErrorCallBack){


   // var id , result , status;

  // for(i=0;i<locations.length;i++){

     // result = locations[i].title.search(keyword);

    // if(result >= 0){

   //    status = true;

    //   break;
    // }
    // else{
    //  status = false;
   //  }
   //}

  // if(status == true){
  //    SuccessCallBack(i);
   //}
  // else{
   //  ErrorCallBack(i);
  // }
   //return id;
 //}


 //$("#filter").click(function(){
  // var text = $("#keyword").val();
//
    //if(text == ''){
    //alert("Please Inter Keyword");
    // return;
    //}

   //search(text,function(i){

   // google.maps.event.trigger(markers[i], 'click');
      //console.log(markers[i]);

  // },function(){
   //  alert("Not found");
   //});

// });

//Show Information about location

  function populateInfoWindow (marker,infowindow ){
if (infowindow.marker !=marker){
  infowindow.marker = marker;
  infowindow.setContent('<div>' + marker.title + '</div>');
  infowindow.open(map , marker);
  marker.addListener('closeclick',function(){
  infowindow.setMarker(null);
//infowindow.open(map ,marker);




 });
 }
}



window.onload = function googleError() {
  document.getElementById('map').innerHTML = "Error in Map!";
};


//Add animation when user click markrs
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

// Cross slide bar
    function hamburger_cross() {

      if (isClosed == true) {
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


