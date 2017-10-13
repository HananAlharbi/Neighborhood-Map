# [Neighborbood Map Project](https://github.com/AyaatELdor/Neighborhood-Map)

Neighborhood map project is developed for Front-End Nanodegree at Udacity.

* This project is built using Google Maps API, Foursquare API and knockoutjs framework.
* Features Include: 
  * A full-screen map to page using the Google Maps API.
  * Map markers identifying a number of favorite locations within Sanjose neighborhood.
  * Search bar functionality.
  * List view of the identified locations.
  * Foursquare API is used to show related info. of the location.
* to run the project:
  - go to [my project](https://github.com/AyaatELdor/Neighborhood-Map)
  - Download / Clone this project
  - Run `index.html`
* get start:
  * define global variable such as
       ```
       var ctrl = this;
       var map, infoWindow;
       ```
  * using function intiMap that initMap Google map based on predefined cairo position
  * define alist of places in cairo
  * using Knockout ViewModel
    * define this scope ``` var ctrl = this; ```
    * define how array using observable 
    
          
          ctrl.markers = ko.observableArray([]);
          ctrl.allLocations = ko.observableArray([]);
          .
          
    * call initmap before start if google map no display show alert to you to tell him
    * try to show the content about the places on time when click on marker or click on list view
    
           
          ctrl.clickHandler = function(data) {
          centerLocation(data, ctrl.map(), ctrl.markers); 
          // call centerLocation fumction and pass last value of map and markers that      with data send from click dom
          nfoWindow.setContent(data.marker.content);
          infoWindow.open(ctrl.map(), data.marker);
             };
           .
           
    * define  fetchForsquare function which get location
    * loop on all places in model using **foreach**
    * call foursquare api using client_id and client_secret that created with application on foursquare.com
    * send http request using get method that return json
    * clickHandler on location list view
    
            
           function centerLocation(data, map, markers) { 
                     for (var i = 0; i < markers().length; i++) {
                         markers()[i].infowindow.close();
                     }
           
      
    * set lat and lng on map using location to focus on it
       
          map.setCenter(new google.maps.LatLng(data.location.lat,      data.location.lng));
          map.setZoom(12);
          for (i = 0; i < markers().length; i++) {
                 var content = markers()[i].content.split('<br>');
                 if (data.name === content[0]) {
                       toggleBounce(markers()[i]);
                 }
           } 

[Demo](http://subratrout.github.io/neighborhood-map)

## Suggestions and Inputs welcome

Anyone and everyone is welcome to [Suggest](CONTRIBUTING.md).

References:

[Knockout Documentation](http://knockoutjs.com/documentation/introduction.html)

[Google Map API](https://developers.google.com/maps/documentation/javascript/tutorial)

[Foursquare API](https://developer.foursquare.com)

[Udacity Intro to Ajax](https://www.udacity.com/course/ud110)

[DawoonC's DW Neighborrhood](https://github.com/DawoonC/dw-neighborhood)
