'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['uiGmapgoogle-maps'])
    .config(['uiGmapGoogleMapApiProvider'
      , function(GoogleMapApi) {
        GoogleMapApi.configure({
          key: 'AIzaSyDxhBvEAPgJNWhR-UbnDEusPT29neQkV0k',
          v: '3.17',
          libraries: 'weather,geometry,visualization'
        });
    }])

    .controller('controlController', function ($scope) {
      $scope.controlText = 'I\'m a custom control';
      $scope.danger = false;
      $scope.controlClick = function () {
        $scope.danger = !$scope.danger;
        alert('custom control clicked!')
      };
    })

    .controller("myAppCtrl", ['$scope','$http','uiGmapGoogleMapApi'
      , function($scope, $http, GoogleMapApi) {

      // Do this here to ensure that the maps API is loaded before we do anything else
      GoogleMapApi.then(function(maps) {
        $scope.googleVersion = maps.version;
        maps.visualRefresh = true;

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
          bounds: {}
        }
        });

        $scope.refreshMap = function () {
          //optional param if you want to refresh you can pass null undefined or false or empty arg
          $scope.map.control.refresh({latitude: 51.5227, longitude: -0.0845});
          $scope.map.control.getGMap().setZoom(16);
          return;
        };

        $scope.getMapInstance = function () {
          alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
          return;
        };


        var versionUrl = (window.location.host === "rawgithub.com" || window.location.host === "rawgit.com") ?
            "../package.json" : "/package.json";

        $http.get(versionUrl).success(function (data) {
          if (!data)
            console.error("no version object found!!");
          $scope.version = data.version;
        });
      });

    }]);
