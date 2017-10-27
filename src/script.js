var map, infowwindow;
       function initMap() {
         var map = new google.maps.Map(document.getElementById('map'), {
           center: new google.maps.LatLng(24.782661, 46.629109),
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP

     }
 );
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



  function populateInfoWindow (marker,infowindow ){

  var wikiURL;
  var streetViewService = new google.maps.StreetViewService();
  wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
  var wikiRequestTimeOut = setTimeout(function(){
   // $wikiElem.text("faild no get wikipedia resources");
  }, 8000);

  //ajax request
  $.ajax({
            url: wikiURL,
            dataType: "jsonp"
            //jsnop datatype
        }).done(function(response) {
             clearTimeout(wikiRequestTimeOut);
            //response from wikipedia api
            URL = response[3][0];
            //getpanorama function is invoked

            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        });

  if (infowindow.marker !=marker){
  infowindow.marker = marker;
  infowindow.setContent('<div>' + marker.title + '</div>');
 // infowindow.open(map , marker);

  marker.addListener('closeclick',function(){
  infowindow.setMarker(null);
// infowindow.open(map ,marker);

});
 var radius = 50;
  
    var getStreetView = function (data, status){
    if (status == google.maps.StreetViewStatus.OK){
     

      var fenway = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(
      fenway, marker.position);
      infowindow.setContent('<div>' + marker.title + '</div><br><a href ="' + URL + '">' + URL + '</a><hr><div id="pano"></div>');
      var panoramaOptions = {

      position: fenway,
      pov: {
        heading: heading,
         pitch: 10,

        }
        //panorama.setVisible(true);
      };
       
       var panorama = new google.maps.StreetViewPanorama(
       document.getElementById('pano'), panoramaOptions);
       } else {
        
    infowindow.setContent('<div>' + marker.title + '</div>' +'<div>Street View data not found for this location</div>' );
     }

   //open infowindow on that marker
    infowindow.open(map, marker);
    };
  }
 }

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