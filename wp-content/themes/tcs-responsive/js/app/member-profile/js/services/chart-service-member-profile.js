/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

angular.module('tc.chartService', [])

.factory('ChartService', ['ColorService',
  function (ColorService) {
    return {

      /**
       *  Draw a pie.
       */
      'drawPie': function (element, option, successRate) {

        var text = [{
          name: 'Division 1',
          color: '#81bc01'
        }, {
          name: 'Division 2',
          color: '#81bc01'
        }, {
          name: 'Challenge',
          color: '#ffae00'
        }];

        element.highcharts({
          "credits": {
            "enabled": false
          },
          "chart": {
            "type": "pie",
            "margin": 0,
            "marginRight": 0,
            "borderWidth": 0,
            "marginBottom": 0,
            "width": 236,
            "height": 164
          },
          "plotOptions": {
            "pie": {
              "dataLabels": {
                "enabled": false
              },
              "borderWidth": 0,
              "shadow": false,
              "states": {
                "hover": false
              }
            }
          },
          "title": {
            "text": null
          },
          "yAxis": {
            "title": {
              "enabled": false
            }
          },
          "tooltip": {
            "enabled": false
          },
          "series": [{
            "type": "pie",
            "innerSize": "90%",
            "name": "Rating",
            "data": [{
              "name": text[option].name,
              "color": text[option].color,
              "y": successRate
            }, {
              "name": "null",
              "color": "#eeeeee",
              "y": 100 - successRate
            }]
          }]
        });
      },

      /**
       * draw a history.
       */
      'drawHistory': function (element, data) {

        element.highcharts({
          chart: {
            'type': 'line',
            'marginRight': 15,
            'marginLeft': 50,
            'marginBottom': 20,
            'marginTop': 20,
            'width': 768
          },
          credits: {
            'enabled': false
          },
          title: {
            'text': null
          },
          yAxis: {
            'title': {
              'text': null
            },
            'plotLines': [{
              'value': 0,
              'width': 1,
              'color': '#808080'
            }],
            'plotBands': [{
              "from": 0,
              "to": 899,
              "color": "rgba(153, 153, 153, 0.2)"
            }, {
              "from": 900,
              "to": 1199,
              "color": "rgba(0, 169, 0, 0.2)"
            }, {
              "from": 1200,
              "to": 1499,
              "color": "rgba(102, 102, 255, 0.2)"
            }, {
              "from": 1500,
              "to": 2199,
              "color": "rgba(221, 204, 0, 0.2)"
            }, {
              "from": 2200,
              "to": 10000,
              "color": "rgba(238, 0, 0, 0.2)"
            }]
          },
          xAxis: {
            'type': "datetime",
            'dateTimeLabelFormats': {
              year: '%Y'
            },
            'tickInterval': 24 * 3600 * 1000 * 356 // one year interval in milliseconds
          },
          legend: {
            'enabled': false
          },
          tooltip: {
            'formatter': function () {
              return 'Challenge: <b>' + this.point.name + '</b><br/>Date: ' +
                Highcharts.dateFormat('%e %b %Y', this.x) + '<br/>Rating: ' + this.y;
            }
          },
          series: [{
            'name': 'Rating',
            'color': '#888888',
            "lineWidth": 1,
            'data': data.hseries
          }]
        });

      },
      /**
       * draw a distribution.
       */
      'drawDistribution': function (element, data, rating) {

        element.highcharts({
          chart: {
            'type': 'column',
            'marginLeft': 50,
            'marginRight': 20,
            'marginBottom': 70,
            'width': 768
          },
          credits: {
            'enabled': false
          },
          title: {
            'text': null
          },
          plotOptions: {
            'series': {
              'minPointLength': 3
            }
          },
          yAxis: {
            'title': {
              'text': null
            },
            'plotLines': [{
              'value': 0,
              'width': 1,
              'color': '#808080'
            }]
          },
          xAxis: {
            'title': {
              'text': null
            },
            'min': 50,
            'labels': {
              'rotation': 90,
              'step': 1,
              'formatter': function () {
                var vm = parseInt(this.value) - 50;
                var vMx = parseInt(this.value) + 49;
                return vm + '-' + vMx;
              },
              'y': 18,
              'x': -4
            },
            tickPositioner: function () {
              var positions = [],
                tick = 50,
                increment = 100;

              for (; tick - increment <= this.dataMax; tick += increment) {
                positions.push(tick);
              }
              return positions;
            }
          },
          legend: {
            'enabled': false
          },
          tooltip: {
            'formatter': function () {
              return this.y + ' Coders';
            }
          },
          series: [{
            'name': 'Distribution',
            'color': '#888888',
            "lineWidth": 1,
            'data': data.dseries
          }]
        });

        element.highcharts().xAxis[0].addPlotLine({
          value: rating,
          color: ColorService.getPointColor(rating),
          width: 2,
          label: {
            text: rating,
            style: {
              color: ColorService.getPointColor(rating)
            }
          }
        });

      },
      /**
       * Convert the API stats into the valid formats which the others method in ChartService can accept.
       */
      'ingest': function (historyData, distributionData) {

        var ingestedData = {
          hseries: [],
          dseries: []
        };

        $(historyData).each(function () {
          ingestedData.hseries.push({
            'x': moment(this.date, "YYYY-MM-DD").valueOf(),
            'y': this.rating,
            'name': this.challengeName,
            'marker': {
              'fillColor': ColorService.getPointColor(this.rating),
              'radius': 4,
              'lineWidth': 0,
              'lineColor': '#666'
            }
          });
        });

        var maxVal = -1;
        var maxIndex = 0;
        $(ingestedData.hseries).each(function (index) {

          if (this.y > maxVal) {
            maxVal = this.y;
            maxIndex = index;
          }
        });

        //show the highest rating more bigger.
        if (maxVal !== -1) {
          var marker = ingestedData.hseries[maxIndex].marker;
          marker.lineWidth = 2;
          marker.radius = 7;
        }

        function SortByX(a, b) {
          return ((a.x < b.x) ? -1 : ((a.x > b.x) ? 1 : 0));
        }
        ingestedData.hseries.sort(SortByX);

        $(distributionData).each(function () {
          var range = this.range.split('-');
          var mean = (parseInt(range[0]) + parseInt(range[1])) / 2;
          ingestedData.dseries.push({
            'x': mean,
            'y': this.number === 0 ? null : this.number,
            'color': ColorService.getPointColor(mean)
          });
        });

        return ingestedData;
      }
    };
  }
]);