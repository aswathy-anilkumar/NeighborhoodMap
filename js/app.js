var models = [
          {
          	placename: 'Napier museum',
            placeID: "4b985fb9f964a520af3e35e3",
            selection: false,
            show: true,
            lat:8.509140 ,
            lng:76.955219
          },
          {
          	placename: 'Zoo',
            placeID: "4e7482561495be5170af546a",
            selection: false,
            show: true,
            lat:8.510555,
            lng:76.955499
          },
          {
          	placename: 'Kowdiar palace',
            placeID: "51177670e4b0e3bf0160fb14",
            selection: false,
            show: true,
            lat:8.524001 ,
            lng:76.963187
          },
          {
          	placename: 'Sree Padmanabha Swamy Temple ',
            placeID: "4baf0a21f964a52038e83be3",
            selection: false,
            show: true,
            lat:8.482838,
            lng:76.944161
          },
          {
          	placename: 'Sri Swathi Thirunal Museum',
            placeID: "4c6a61ebd0bdc9b6a44ca80b",
            selection: false,
            show: true,
            lat:8.481147 ,
            lng:76.945108
          }

];





var viewModel = function() {

  var self = this;
  self.error=ko.observable('');
  self.place_input = ko.observable('');
  self.selected_place = ko.observableArray([]);
 //This function take in color  and then create a new marker

  self.makeMarkerIcon = function(markerColor) {

      var markerImage = new google.maps.MarkerImage(
              'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
              '|40|_|%E2%80%A2',
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34),
              new google.maps.Size(21,34));
      return markerImage;
  };

      var highlightedIcon = self.makeMarkerIcon('FF0000');
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      var myIcon = iconBase + "info-i_maps.png";

  models.forEach(function(counter){

      var marker = new google.maps.Marker({
        placename:counter.placename,
        position: {lat:counter.lat, lng:counter.lng},
        show: ko.observable(counter.show),
        placeID:counter.placeID,
        selection: ko.observable(counter.selection),
        animation: google.maps.Animation.DROP,
        map: map,
        icon: myIcon,
        id: 1
      });

      self.selected_place.push(marker);

      marker.addListener('mouseout', function(){
      this.setIcon(myIcon);
      });

      marker.addListener('mouseover', function(){
      this.setIcon(highlightedIcon);
      });

      marker.addListener('click', function(){
      self.makeBounce(marker);
      self.populateInfoWindow(this, largeInfowindow);
      self.addApiInfo(marker);

      });
  });

      var largeInfowindow = new google.maps.InfoWindow();
      self.no_places = self.selected_place.length;
      self.current_place = self.selected_place[0];

  self.populateInfoWindow = function(marker, infowindow) {

      // Check  infowindow is not already opened through marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content streetview to load.
        infowindow.setContent();
        infowindow.marker = marker;
        //  marker property is cleared if  infowindow is closed.
        infowindow.addListener('closeclick', function() {
          if(infowindow.marker !== null)
               infowindow.marker.setAnimation(null);
          infowindow.marker = null;
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options

        self.getStreetView = function(data, status) {

            if (status == google.maps.StreetViewStatus.OK) {

              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);

              infowindow.setContent('<div>' + marker.placename + '</div><div id="pano"></div>');

              var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
              };

              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            }

            else {
              infowindow.setContent('<div>' + marker.placename + '</div>' +
                '<div>No Street View Found</div>');
            }

        };



      }

  };
  self.makeBounce = function(counter_marker){
    counter_marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){counter_marker.setAnimation(null);},700);
  };

  self.addApiInfo = function(counter_marker){
      $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + counter_marker.placeID + '?client_id=MGVKRDACHDQFKE24CSNGUOO2JQIRL4AGJ3NWSHLI4N4EGGHL&client_secret=VJ50CPR42GOJRUIVJU2DPYCX2SISJGXHXSW1J34OCJ2O53ED&v=20170718',
        dataType: "json",
        success: function(data){

          var out = data.response.venue;
          counter_marker.likes = out.hasOwnProperty('likes') ? out.likes.summary: "No info available";
          counter_marker.rating = out.hasOwnProperty('rating') ? out.rating: "No info Available";
          infowindow.setContent('<div>' + counter_marker.placename + '</div><p>' +
  			counter_marker.likes + '</p><p>Rating: ' +
  			counter_marker.rating +'</p><div id="pano"></div>');
          	var streetViewService = new google.maps.StreetViewService();
          	var radius = 50;
          	streetViewService.getPanoramaByLocation(counter_marker.position, radius, self.getStreetView);
          infowindow.open(map, counter_marker);
        },
        error:function(e){
        	self.error("Foursquae data is invalid,Please Try Again ");
        }
      });
  };

  /*for(var counter = 0;counter < self.no_places;counter ++){
    (function(counter_marker){
    self.addApiInfo(counter_marker);
     counter_marker.addListener('click', function()
     {
      self.dMark(counter_marker);
      });
    })(self.selected_place()[counter]);
  }*/



self.no_place.forEach(function(place, counter) {
(function(counter_marker){
counter.addApiInfo(counter_marker);
 counter_marker.addListener('click', function()
 {
  counter.dMark(counter_marker);
  });
})(counter.selected_place());
});






  self.dMark = function(marker) {

   google.maps.event.trigger(marker,'click');
  };



  self.display_full=function(){
  	for (var counter = 0; counter < self.selected_place().length; counter ++) {

          self.selected_place()[counter].setVisible(true);
          self.selected_place()[counter].show(true);
        }

  };
  self.display_refreshed=function(temp_input){
  		for (var counter = 0; counter < self.selected_place().length; counter ++) {
          if (self.selected_place()[counter].placename.toLowerCase().indexOf(temp_input.toLowerCase()) > -1) {
           self.selected_place()[counter].show(true);
           self.selected_place()[counter].setVisible(true);
          }
          else {
          self.selected_place()[counter].show(false);
          self.selected_place()[counter].setVisible(false);
          }
       }
  };

  self.refresh_List = function() {

      var temp_input=self.place_input();
      infowindow.close();

      if(temp_input.length === 0) {
        	self.display_full();
      }

      else {
       		 self.display_refreshed(temp_input);
      }

      infowindow.close();
  };


};

var map;
var infoWindow;

function initMap() {
	//create a style array to use with the map.
	var styles = [
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },
          {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },
          {
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },
          {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          }
];
  map = new google.maps.Map(
  document.getElementById('map'),{
  center: {lat: 8.482048, lng: 76.947448},
  zoom:12,
  mapTypeControl:false,
  styles:styles
  });
infowindow = new google.maps.InfoWindow();
ko.applyBindings(new viewModel());
}

function errorHandling(){
  document.getElementById('map-error').innerHTML = "invalid_map";
}

            lng: 76.945108
        },
        title: "Sri Swathi Thirunal Museum",
        address: "East Fort, Pazhavangadi, Thiruvananthapuram",
        show: true,
        select: false,
        id: '4c6a61ebd0bdc9b6a44ca80b'
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 8.482048,
            lng: 76.947448
        },
        zoom: 12
    });

    // creating infoWindow
    largeInfoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new viewModel());
}

function viewModel() {
    selectedloc = ko.observable('');
    var self = this;
    self.markers = [];
    self.populateInfoWindow = function(marker, infowindow) {
        console.log(marker.id + marker.title);
        $.ajax({
            method: 'GET',
            dataType: "json",
            url: "https://api.foursquare.com/v2/venues/" + marker.id + '?ll=40.7,-74&client_id=MGVKRDACHDQFKE24CSNGUOO2JQIRL4AGJ3NWSHLI4N4EGGHL&client_secret=VJ50CPR42GOJRUIVJU2DPYCX2SISJGXHXSW1J34OCJ2O53ED&v=20170101',
            success: function(data) {

                var final = data.response.venue;
                console.log(final);
                if ((final.hasOwnProperty('likes'))) {
                    marker.likes = final.likes.count;
                    infowindow.setContent(marker.title + "\nLikes" + final.likes.count);
                    infowindow.open(map, marker);
                    infowindow.addListener('closeclick', function() {
                        infowindow.marker = 0;
                    });
                } else {
                    marker.likes = 'error';
                }
            },
            error: function(e) { //error handling
                alert('There is some error in fetching data');
            }

        });
    };

    // bouncing effect on markers
    self.Bounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 750);
        }
    };

    //creating markers array
    for (var i = 0; i < locArray.length; i++) {
        var position = locArray[i].location;
        var title = locArray[i].title;
        var id = locArray[i].id;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            id: id,
            select: ko.observable(locArray[i].select),
            show: ko.observable(locArray[i].show),
            animation: google.maps.Animation.DROP
        });
        self.markers.push(marker);
        bounds.extend(marker.position);
        // on click infowindow will open
        marker.addListener('click', function() {
            self.populateInfoWindow(this, largeInfoWindow);
        });
        // on click marker will bounce
        marker.addListener('click', function() {
            self.Bounce(this);
        });
    }
    
    map.fitBounds(bounds);

    self.inputValue = ko.observable();
    self.filtersearch = function() {
        largeInfoWindow.close();

        var Search = self.inputValue();

        if (Search.length === 0) {
            this.showAll(true);
        } else {

            for (i = 0; i < self.markers.length; i++) {
                var m = self.markers[i].title.toLowerCase();

                if (self.m.indexOf(Search.toLowerCase()) >= 0) {
                    self.markers[i].show(true);
                    self.markers[i].setVisible(true);
                    self.markers[i].select(true);

                } else {
                    self.markers[i].show(false);
                    self.markers[i].setVisible(false);
                    self.markers[i].select(false);

                }
            }
        }
        largeInfoWindow.close();
    };
    this.showAll = function(element) {
        for (i = 0; i < self.markers.length; i++) {
            self.markers[i].show(element);
            self.markers[i].selected(true);
            self.markers[i].setVisible(element);
        }
    };
}
