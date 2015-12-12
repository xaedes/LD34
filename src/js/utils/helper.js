'use strict';
define(["phaser"], function(Phaser) {

    // source: http://stackoverflow.com/a/979995
    return {
        "QueryString": function () {
            // This function is anonymous, is executed immediately and
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    query_string[pair[0]] = [query_string[pair[0]], decodeURIComponent(pair[1])];
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            return query_string;
        }(),


	    "randomNormal": function (rnd, mean, std) {
            var num = 0;
            for (var i = 0; i < 12; i++) {
                num += rnd.realInRange(0.0, 1.0)
            }

            num -= 6;
            num *= std;
            num += mean;

            return num;
	    },

         "BitmapDataFromImage": function (game, imageKey) {
            var colormap = new Phaser.Image(game, 0, 0, "colormap");
            var colormap_bm = new Phaser.BitmapData(game, "bm_colormap",colormap.width, colormap.height);
            colormap_bm.draw(colormap);
            colormap_bm.update();
            return colormap_bm;
        },

        "clone": function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
    };
});
