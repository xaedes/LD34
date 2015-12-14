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
    }
    Genome.prototype.constructor = Genome;
    return Genome;
});