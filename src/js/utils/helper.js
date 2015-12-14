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


	    "randomNormal": function (mean, std) {
            var n = 12;
            var num = 0;
            for (var i = 0; i < n; i++) {
                num += Math.random()
            }

            num -= n/2;
            num *= std;
            num += mean;

            return num;
	    },

         "BitmapDataFromImage": function (game, imageKey) {
            var colormap = new Phaser.Image(game, 0, 0, imageKey);
            var colormap_bm = new Phaser.BitmapData(game, "bm_"+imageKey, colormap.width, colormap.height);
            colormap_bm.draw(colormap);
            colormap_bm.update();
            return colormap_bm;
        },

        "BitmapDataFromTexture": function (game, texture) {
            var colormap = new Phaser.Image(game, 0, 0, texture);
            var colormap_bm = new Phaser.BitmapData(game, "bm_krtszt", colormap.width, colormap.height);
            colormap_bm.draw(colormap);
            colormap_bm.update();
            return colormap_bm;
        },

        "randomPointOnLine": function(line, min, max) {
            var out = new Phaser.Point();
            var t = Math.random() * (max - min) + min;

            out.x = line.start.x + t * (line.end.x - line.start.x);
            out.y = line.start.y + t * (line.end.y - line.start.y);

            return out;
        },

        "clone": function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },
        "gainFilter": function(value, otherValue, gain) {
            return value * gain + (1-gain) * otherValue;
        }
    };
});
