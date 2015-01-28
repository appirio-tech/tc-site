/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

angular.module('tc.colorService', [])

.factory('ColorService', function () {
  return {
    /**
     * Get rating color name for the given rating.
     */
    'getRatingColor': function (rating) {

      if (rating < 900)
        return "coderTextGray";

      if (rating < 1200)
        return "coderTextGreen";

      if (rating < 1500)
        return "coderTextBlue";

      if (rating < 2200)
        return "coderTextYellow";

      if (rating >= 2200)
        return "coderTextRed";

      return "coderTextBlack";
    },
    /**
     * Get rating color for the given point, which is used in drawing distribution and history chart.
     */
    'getPointColor': function (rating) {

      if (rating < 900)
        return "#999999";

      if (rating < 1200)
        return "#00A900";

      if (rating < 1500)
        return "#6666FF";

      if (rating < 2200)
        return "#DDCC00";

      if (rating >= 2200)
        return "#EE0000";

      return "#000";
    }
  };
});