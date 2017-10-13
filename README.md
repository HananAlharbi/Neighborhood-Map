# Neighborhood-Map



This project is built using Google Maps API, Foursquare API.

*Features Include:
A full-screen map to page using the Google Maps API.
Map markers identifying a number of favorite locations within Ghirnatah neighborhood.

*Search bar functionality.
List view of the identified locations.
Foursquare API is used to show related info. of the location.
*To run the project:
go to my project
Download / Clone this project
Run index.html
get start:
define global variable such as
var ctrl = this;
var map, infoWindow;
using function intiMap that initMap Google map based on predefined cairo position
define alist of places in cairo
using Knockout ViewModel
define this scope var ctrl = this;


*Call initmap before start if google map no display show alert to you to tell him

-Try to show the content about the places on time when click on marker or click on list view


 
-Define fetchForsquare function which get location

-loop on all places in model using foreach

-call foursquare api using client_id and client_secret that created with application on foursquare.com

send http request using get method that return json

-clickHandler on location list view


-set lat and lng on map using location to focus on it

