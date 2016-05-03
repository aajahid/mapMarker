mapMarker = (function(){

    map = null;
    mapData = [];
    markers = [];
    __openInfoWindow = null, // reference to current open info window


    /**
     * Initialize the app
     */
    init = function() {

        init_map();
        getMapsData(function(data){
            mapData = data;
            addAllMarker(mapData);
        });

        setInterval(function(){
            clearMarker();
            getMapsData(function(data){
                mapData = data;
                addAllMarker(mapData);
            });
        }, 1000*60*5);
        
    }

    /**
     * Initialize the map
     */
    init_map = function() {
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: new google.maps.LatLng(23.8251592,90.3798797),
          mapTypeId: google.maps.MapTypeId.TERRAIN
      });
    }


    /**
     * Get updated data from the API
     */
    getMapsData = function(callback) {


        $.ajax({
            url: "MapsJson.json",
            cache: false,
            success: function(data){
                if( typeof(callback) == 'function' ) {
                    callback(data);
                }
            }
        });

    }


    addMarker = function(locationItem) {

        var infowindow = new google.maps.InfoWindow({
            content: "ID = "+locationItem.Id+ "<br>" +
                     "Lat = "+locationItem.Latitude+ "<br>" +
                     "Lng = "+locationItem.Longitude 
        });
        var marker = new google.maps.Marker({
            position: {lat: locationItem.Latitude, lng: locationItem.Longitude},
            map: map
        });

        marker.addListener('click', function() {
            // Close current open 
            if( __openInfoWindow ) {
                __openInfoWindow.close();
            }
            infowindow.open(map, marker);
            __openInfoWindow = infowindow;
        });

        markers.push(marker);
        return marker;

    }

    clearMarker = function(){
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }


    addAllMarker = function(locationData) {
        for (var i = 0; i < locationData.length; i++) {
            marker = addMarker(locationData[i])
            marker.setMap(map);
        }
    }



    return {
        init: this.init,
        map: this.map
    }

})();

mapMarker.init(); 


  //     // Loop through the results array and place a marker for each
  //     // set of coordinates.
  //     window.eqfeed_callback = function(results) {
  //       for (var i = 0; i < results.features.length; i++) {
  //         var coords = results.features[i].geometry.coordinates;
  //         var latLng = new google.maps.LatLng(coords[1],coords[0]);
  //         var marker = new google.maps.Marker({
  //           position: latLng,
  //           map: map
  //       });
  //     }
  // }
