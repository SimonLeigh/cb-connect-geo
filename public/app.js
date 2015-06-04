'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['uiGmapgoogle-maps','ui.bootstrap'])
    .config(['uiGmapGoogleMapApiProvider'
        , function(GoogleMapApi) {
            GoogleMapApi.configure({
                key: 'AIzaSyDxhBvEAPgJNWhR-UbnDEusPT29neQkV0k',
                v: '3.17',
                libraries: 'weather,geometry,visualization'
            });
        }
    ])
    .config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    })



    .controller("myAppCtrl", ['$scope','$timeout','$http','uiGmapGoogleMapApi'
        , function($scope, $timeout, $http, GoogleMapApi) {
            $scope.rowCollection=[];


            // Do this here to ensure that the maps API is loaded before we do anything else
            GoogleMapApi.then(function(maps) {
                $scope.googleVersion = maps.version;
                maps.visualRefresh = true;


                $scope.refreshMap = function () {
                    //optional param if you want to refresh you can pass null undefined or false or empty arg
                    $scope.map.control.refresh({latitude: 51.5227, longitude: -0.0845});
                    $scope.map.control.getGMap().setZoom(16);

                }

                $scope.refreshMapCA = function () {
                    //optional param if you want to refresh you can pass null undefined or false or empty arg
                    $scope.map.control.refresh({latitude: 37.4034, longitude: -121.9696});
                    $scope.map.control.getGMap().setZoom(17);

                };

                $scope.getMapInstance = function () {
                    alert("You have Map Instance of" + $scope.map.control.getGMap().toString());

                };

                $scope.findEvents=function() {
                    if ($scope.map.bounds) {
                        $scope.rowCollection = [];
                        $scope.map.eventMarkers = [];
                        return $http.get("/api/events/findEvents", {
                            params: {
                                ne_lat: $scope.map.bounds.northeast.latitude,
                                ne_lon: $scope.map.bounds.northeast.longitude,
                                sw_lat: $scope.map.bounds.southwest.latitude,
                                sw_lon: $scope.map.bounds.southwest.longitude
                            }
                        }).then(function (response) {
                            var markers = [];
                            console.log(response);
                            if (response.data.length > 0) {
                                $scope.empty = false;
                            }
                            for (var j = 0; j < response.data.length; j++) {
                                $scope.rowCollection.push(response.data[j]);
                                markers.push(
                                    createMarkerFromRow(response.data[j], j)
                                );
                            }
                            if (!$scope.empty) {
                                $scope.map.eventMarkers = markers;
                            }
                        });
                    }
                };

                $scope.findEventsWithDate=function() {
                    if ($scope.map.bounds) {
                        $scope.rowCollection = [];
                        $scope.map.eventMarkers = [];
                        return $http.get("/api/events/findEventsWithDate", {
                            params: {
                                ne_lat: $scope.map.bounds.northeast.latitude,
                                ne_lon: $scope.map.bounds.northeast.longitude,
                                sw_lat: $scope.map.bounds.southwest.latitude,
                                sw_lon: $scope.map.bounds.southwest.longitude,
                                start: Date.parse($scope.dt)/1000,
                                end: Date.parse($scope.enddt)/1000
                            }
                        }).then(function (response) {
                            var markers = [];
                            console.log(response);
                            if (response.data.length > 0) {
                                $scope.empty = false;
                            }
                            for (var j = 0; j < response.data.length; j++) {
                                $scope.rowCollection.push(response.data[j]);
                                markers.push(
                                    createMarkerFromRow(response.data[j],j)
                                );
                            }
                            if (!$scope.empty) {
                                $scope.map.eventMarkers = markers;
                            }
                        });
                    }
                };

/*                $scope.findEventsWithDate=function() {
                    if ($scope.map.bounds) {
                        $scope.rowCollection = [];
                        $scope.map.eventMarkers = [];

                        var s_range = [];
                        var e_range = [];

                        // Create our start and end ranges
                        s_range.push($scope.map.bounds.southwest.longitude);
                        s_range.push($scope.map.bounds.southwest.latitude);
                        s_range.push(Date.parse($scope.dt)/1000);

                        e_range.push($scope.map.bounds.northeast.longitude);
                        e_range.push($scope.map.bounds.northeast.latitude);
                        e_range.push(Date.parse($scope.enddt)/1000);


                        return $http.get("http://192.168.109.101:8092/CouchPlaces/_design/byLoc/_spatial/byLatLonDate", {
                            params: {
                                start_range: "[" + s_range.toString() + "]",
                                end_range: "[" + e_range.toString() + "]",
                                stale: false,
                                connect_timeout: 60000,
                                limit: 500,
                                skip: 0},
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                                                       }
                        }).success(function (res) {
                            console.log(res);
                            var markers = [];
                            if (res.rows.length > 0) {
                                $scope.empty = false;
                            }
                            for (var j = 0; j < res.rows.length; j++) {
                                $scope.rowCollection.push(res.rows[j]);
                                markers.push(
                                    createMarkerFromRow(res.rows[j],j)
                                );
                            }
                            if (!$scope.empty) {
                                $scope.map.eventMarkers = markers;
                            }
                        });
                    }
                };*/

                var createMarkerFromRow = function (row, j) {

                    // Extract location from key
                    var latitude = row.key[1][0];
                    var longitude = row.key[0][0];
                    var ret = {
                        icon: 'images/couchbase-circle-symbol.png',
                        latitude: latitude,
                        longitude: longitude,
                        title: row.value.name,
                        // We add on j here, to ensure unique ids for markers
                        id: row.id + j,
                        data: row
                    };
                    console.log(ret);
                    return ret;
                };

                var onMarkerClicked = function (marker) {
                    marker.showWindow = true;
                    $scope.$apply();
                    window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
                };

                $scope.removeMarkers = function () {
                    $scope.map.eventMarkers = [];
                };

                angular.extend($scope, {
                    map: {
                        show: true,
                        control: {},
                        version: "unknown",
                        showTraffic: true,
                        showBicycling: false,
                        showWeather: false,
                        center: {
                            latitude: 45,
                            longitude: -73
                        },
                        options: {
                            streetViewControl: false,
                            panControl: false,
                            maxZoom: 20,
                            minZoom: 3
                        },
                        zoom: 3,
                        dragging: false,
                        bounds: {},
                        eventMarkers: [],
                        events:{
                            dragend: function () {
                                $timeout(function () {
                                    var markers = [];
                                    $scope.findEvents();
                                });
                            }
                        },
                    }
                });

                // Get rid of window if clicked twice.
                $scope.map.eventMarkers.forEach( function (marker) {
                    marker.onClicked = function () {
                        onMarkerClicked(marker);
                    };
                    marker.closeClick = function () {
                        marker.showWindow = false;
                        $scope.$evalAsync();
                    };
                });

                $scope.today = function () {
                    $scope.dt = new Date();
                    $scope.enddt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                    $scope.enddt = null;

                };

                // Disable weekend selection
                $scope.disabled = function (date, mode) {
                    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                };

                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.open1 = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened1 = true;
                };
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];

                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                var afterTomorrow = new Date();
                afterTomorrow.setDate(tomorrow.getDate() + 2);
                $scope.events =
                    [
                        {
                            date: tomorrow,
                            status: 'full'
                        },
                        {
                            date: afterTomorrow,
                            status: 'partially'
                        }
                    ];

                $scope.getDayClass = function (date, mode) {
                    if (mode === 'day') {
                        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                        for (var i = 0; i < $scope.events.length; i++) {
                            var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                            if (dayToCheck === currentDay) {
                                return $scope.events[i].status;
                            }
                        }
                    }

                    return '';
                };

            });

            //// ▶▶ Jquery inside Angular ◀◀ ////
            $('.input-daterange').datepicker({"todayHighlight": true, "autoclose":true,"startDate":"+0d"});

        }
    ]);

