var map;
var largeInfoWindow,bounds;

var locArray = [
    {
        location: {lat: 30.7525,
        lng: 76.8101},
        title: "Rock Garden",
        show : true,
        select : false,
        id : '4b6fe660f964a5206dff2ce3'
    },
    {
        location: {lat: 30.7421,
        lng: 76.8188},
        title: "Sukhna Lake",
        show : true,
        select : false,
        id : '5204feb1498ed42a61bafb61'
    },
    {
        location: {lat: 30.7461,
        lng: 76.7820},
        title: "Rose Garden",
        show : true,
        select : false,
        id : '4c0ba827009a0f47975cebbf'
    },
    {
        location: {lat: 30.7941,
        lng: 76.9147},
        title: "Pinjor Garden",
        show : true,
        select : false,
        id : '50f2dd31e4b0ff7d3253b877'
    },
    {
        location: {lat: 30.7056,
        lng: 76.8013},
        title: "elante mall",
        show : true,
        select : false,
        id : '5114cd90e4b06bb0ed15a97f'
    }
    ];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.7333 , lng: 76.7794},
        zoom: 12
    });

// creating infoWindow
largeInfoWindow = new google.maps.InfoWindow();
bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new viewModel());
}

function viewModel() {
    selectedloc = ko.observable('');
    var self=this;
    self.markers=[];
    self.populateInfoWindow = function(marker,infowindow) {
        console.log(marker.id +marker.title);
        $.ajax({
            method: 'GET',
            dataType: "json",
            url: "https://api.foursquare.com/v2/venues/" + marker.id + '?ll=40.7,-74&client_id=OCOENKHAZZJTCSIZJN2ZCMUEJE01GLSCVBV3PAVGR5KVL2TA&client_secret=0TN5PQPW1CBY2ZGWCPF3GYGPZ500RDUEIE5IPPI4D1W42IVM&v=20170101',
            success: function(data) {

                var final = data.response.venue;
                console.log(final);
                if ((final.hasOwnProperty('likes'))) {
                    marker.likes = final.likes.count;
                    infowindow.setContent(marker.title + "\nLikes" + final.likes.count  );
                    infowindow.open(map, marker);
                    infowindow.addListener('closeclick', function() {
                        infowindow.marker = 0;
                });} else {
                    marker.likes = 'error';
                }
            },
                  error: function(e) {
                alert('There is some error in fetching data');
            }

        });
    }

    // bouncing effect on markers
    self.Bounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        }
        else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null) }, 750);
        }
    }

    //creating markers array
    for(var i=0; i<locArray.length; i++) {
        var position = locArray[i].location;
        var title= locArray[i].title;
        var id = locArray[i].id;
        var marker = new google.maps.Marker({
          map: map,
          position:position,
          title:title,
          id : id,
          select: ko.observable(locArray[i].select),
          show: ko.observable(locArray[i].show),
          animation: google.maps.Animation.DROP
        });
        self.markers.push(marker);
        bounds.extend(marker.position);
        // on click infowindow will open
        marker.addListener('click',function(){
            self.populateInfoWindow(this,largeInfoWindow);
        });
        // on click marker will bounce
        marker.addListener('click',function(){
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
    }
};
