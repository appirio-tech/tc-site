/*global angular: true*/
(function() {
  angular.module('tcDateFilters', [])
    .filter('timeLeft', function() {
      return function(seconds, grid) {
        var sep = (grid) ? '' : ' ';
        if (seconds < 0) {
          return '<span style="font-size:13px;">0' + sep + '<span style="font-size:10px;">Days</span> 0' + sep + '<span style="font-size:10px;">Hrs</span>';
        }

        var numdays = Math.floor(seconds / 86400);
        var numhours = Math.floor((seconds % 86400) / 3600);
        var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var numseconds = ((seconds % 86400) % 3600) % 60;
        var style = "";
        if (numdays == 0 && numhours <= 2) {
          style = "color:red";
        }
        if (isNaN(numhours)) {
          return "<em style='font-size:13px;'>not available</em>";
        }

        return "<span style='font-size:13px;" + style + "'>" + (numdays > 0 ? numdays + sep + "<span style='font-size:10px;'>Day" + ((numdays > 1) ? "s" : "") + "</span> " : "") + "" + (numdays < 100 ? numhours + sep + "<span style='font-size:10px;'> Hr" + ((numhours > 1) ? "s" : "") + "</span> " : "") + (numdays == 0 ? numminutes + sep + "<span style='font-size:10px;'> Min" + ((numminutes > 1) ? "s" : "") + "</span> " : "") + "</span>";
      };
    });

}(angular));