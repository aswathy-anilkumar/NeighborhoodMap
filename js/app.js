var map;
var largeInfoWindow, bounds;

var locArray = [{
        location: {
            lat: 8.509140,
            lng: 76.955219
        },
        title: "Napier museum",
        address: "LMS Vellayambalam Road, Palayam, Thiruvananthapuram",
        show: true,
        select: false,
        id: '4b985fb9f964a520af3e35e3'
    },
    {
        location: {
            lat: 8.510555,
            lng: 76.955499
        },
        title: "Zoo",
        address: "Nanthancodu, Thiruvananthapuram",
        show: true,
        select: false,
        id: '4e7482561495be5170af546a'
    },
    {
        location: {
            lat: 8.524001,
            lng: 76.963187
        },
        title: "Kowdiar Palace",
        address: "Kowdiar Gardens, Thiruvananthapuram",
        show: true,
        select: false,
        id: '51177670e4b0e3bf0160fb14'
    },
    {
        location: {
            lat: 8.482838,
            lng: 76.944161
        },
        title: "Sree Padmanabha Swamy Temple ",
        address: "East Fort, Pazhavangadi, Thiruvananthapuram",
        show: true,
        select: false,
        id: '4baf0a21f964a52038e83be3'
    },
    {
        location: {
            lat: 8.481147,
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
