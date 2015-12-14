'use strict';

define(['phaser'], function(Phaser) {
    function Genome() {
        // parameter class to hold all parameters relevant to generate a tree
        this.leafDensityResolution = 80;
        this.branchDensityResolution = 80;
        this.startBranchConfig = {
            angle: -90,
            length: 15,
            strength: 20,
            year: 10,
            radius: 50
        };
        this.growRate = 1000 / 25;
        this.growCount = 1500;
        this.leaf = {
            width: 16,
            height: 16,
            padding: 32,
            displacement_x: 0.6, // * leaf_width
            displacement_y: 0.6, // * leaf_height
            leafs_per_frame: 20, 
            alpha: 0.6, 
            num_frames: 50, 
        };

    }
    Genome.prototype.constructor = Genome;
    return Genome;
});