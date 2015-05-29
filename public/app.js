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

    .controller('controlController', function ($scope) {
        $scope.controlText = 'I\'m a custom control';
        $scope.danger = false;
        $scope.controlClick = function () {
            $scope.danger = !$scope.danger;
            alert('custom control clicked!')
        };
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

                $scope.findEventsWithDate=function() {
                    if ($scope.map.bounds) {
                        $scope.rowCollection = [];
                        $scope.map.eventMarkers = [];
                        return $http.get("/api/events/findEvents", {
                            params: {
                                ne_lat: $scope.map.bounds.northeast.latitude,
                                ne_lon: $scope.map.bounds.northeast.longitude,
                                sw_lat: $scope.map.bounds.southwest.latitude,
                                sw_lon: $scope.map.bounds.southwest.longitude,
                                start: $scope.dateForm.start,
                                end: $scope.dateForm.end
                            }
                        }).then(function (response) {
                            var markers = [];
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

                var createMarkerFromRow = function (row, j) {

                    // Extract location from key
                    var latitude = row.key[1][0];
                    var longitude = row.key[0][0];
                    var ret = {
                        latitude: latitude,
                        longitude: longitude,
                        title: row.value.name,
                        id: row.id,
                        data: row
                    };
                    console.log(ret);
                    return ret;
                };

                var onMarkerClicked = function (marker) {
                    marker.showWindow = true;
                    $scope.$apply();
                    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
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


            });

            //// ▶▶ Jquery inside Angular ◀◀ ////
            $('.input-daterange').datepicker({"todayHighlight": true, "autoclose":true,"startDate":"+0d"});

        }
    ]);

