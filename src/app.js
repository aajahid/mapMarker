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
        init_marker();

    }



    init_marker = function() {

        clearMarker();

        getMapsData(function(data){
            mapData = clusterData(data);
            console.log(mapData);
            addAllMarker(mapData);
            setTimeout(init_marker, 1000*60*5);
        });

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
            content: "ID = "+locationItem.EmployeeID.join()+ "<br>" +
                     "Lat = "+locationItem.Latitude+ "<br>" +
                     "Lng = "+locationItem.Longitude 
        });
        var marker = new google.maps.Marker({
            position: {lat: locationItem.Latitude, lng: locationItem.Longitude},
            map: map
        });

        console.log(marker);

        //marker.prototype.infowindow = infowindow;

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

    /**
     *  Cluster data by 100m distance
     *  Produced data structure -
     *
     *  {
     *      EmployeeId: [0, 2, 3],
     *      Latitude: 23.234234
     *      Longitude: 90.234234
     *  }
     *
     */
    clusterData = function(locationData){

        groupData = [];

        for( var i = 0; i < locationData.length; i++ ) {

            if( locationData[i]  ) {

                locationItem = locationData[i];

                groupData[i] = {
                    Latitude: locationItem.Latitude,
                    Longitude: locationItem.Longitude,
                    EmployeeID: [locationItem.Id]
                };

                for( var x = 0; x < locationData.length; x++) {
                    if( x == i ) {
                        continue;
                    }

                    itemLatLng = new google.maps.LatLng(locationItem.Latitude, locationItem.Longitude);
                    item2LatLng = new google.maps.LatLng(locationData[x].Latitude, locationData[x].Longitude);
                    distance = google.maps.geometry.spherical.computeDistanceBetween(itemLatLng, item2LatLng);

                    if( distance <= 100 ) {
                        groupData[i].EmployeeID.push(locationData[x].Id);
                        locationData.splice(x, 1);
                    }
                }
            }
        }

        return groupData;

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