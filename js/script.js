var map, infoWindow;
       function initMap() {
         var map = new google.maps.Map(document.getElementById('map'), {
           center: new google.maps.LatLng(24.782661, 46.629109), 
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP

     }
 );
      var locations = [
       {title:'Starbucks' ,location: {lat: 24.783349, lng: 46.729692}},
       {title:'Imam Muhammed University' ,location: {lat: 24.815595, lng: 46.701577}},
       {title:'Jarir Store' ,location: {lat: 24.766366, lng: 46.755773}},
       {title:'King Fahad BookStore' ,location: {lat: 24.685901, lng: 46.686450}},
       {title:'King Saud University' ,location: {lat: 24.727570, lng: 46.624580}}
     ];


     infowindow = new google.maps.InfoWindow({
    // Need content from data
  });

 
    var bounds = new google.maps.LatLngBounds();
                
      // for (i ; i<locations.length ; i++)
      for (i = 0; i < locations.length; i++)
      {
        var position = locations[i].location;
          var title = locations[i].title;
          var marker = new google.maps.Marker({
                  map: map ,
                  draggable: true,
                  position: position,
                  title:title,
                  animation:google.maps.Animation.DROP,

                  id:i
                });
           marker.addListener('click', toggleBounce);
          var markers =[];

          markers.push(marker);
          bounds.extend(marker.position);
          marker.addListener('click',function() {

          populateInfoWindow(this,largeInfowindow);



     // infowindow.open(map ,marker);
                     });
  }
  function populateInfoWindow (marker,infowindow ){
if (infowindow.marker !=marker){
  infowindow.marker = marker;
  infowindow.setContent('<div>' + marker.title + '</div>');
  infowindow.open(map , marker);
  marker.addListener('closeclick',function(){
  infowindow.setMarker(null);
// infowindow.open(map ,marker);


             });
 }
}
  
function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
           setTimeout(function() {
           marker.setAnimation(null);},650 );
        }
      }




}
