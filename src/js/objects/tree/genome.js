'use strict';

define(['phaser','helper'], function(Phaser,Helper) {
    function Genome(game) {
        this.game = game;
        // parameter class to hold all parameters relevant to generate a tree
        this.leaf_density_resolution = 80;
        this.branch_density_resolution = 80;
        this.start_branch_config = {
        };
        this.grow_rate = 1000 / 25;
        this.grow_count = 1500;
        this.leaf = {
            width: 16,
            height: 16,
            padding: 32,
            displacement_x: 0.6, // * leaf_width
            displacement_y: 0.6, // * leaf_height
            leafs_per_frame: 20, 
            alpha: 0.6, 
            num_frames: 50, 
            colormap: "colormap_green",
            name: "green_leafs",
            emitter: {
                particles_max: 5000,
                scale_min: 0.9,
                scale_max: 1.6,
                y_speed_min: -5,
                y_speed_max: 20,
                x_speed_min: -20,
                x_speed_max: 20,
                alpha_min: 1,
                alpha_max: 0,
                alpha_rate: 5000,
                gravity: 30,
                rotation_min: 0,
                rotation_max: 40,
                angular_drag: 0,
            },
            wind_emitter: {
                particles_max: 500,
                scale_min: 0.9,
                scale_max: 1.6,
                y_speed_min: -15,
                y_speed_max: 20,
                x_speed_min: -0,
                x_speed_max: 80,
                alpha_min: 1,
                alpha_max: 0.2,
                alpha_rate: 10000,
                gravity: 30,
                rotation_min: 0,
                rotation_max: 40,
                angular_drag: 10,
                start_explode: false, 
                start_lifespan: 10000, 
                start_frequency: 1000,
                tree_relative_height: 0.75,
                tree_relative_emit_y: 0.5,
            }
        };
        this.trunk_color = 0x37220f;
        this.trunk_joint_size = 1;
        this.branch = {
            start_config: {
                angle: -90,
                length: 15,
                strength: 20,
                year: 10,
                radius: 50
            },
            pheromone: [1,1,1],
            generateChildren: {
                length: function() { 
                    return game.rnd.realInRange(1, 3)
                },
                strength: function(config) { 
                    return game.rnd.realInRange(
                        Math.min(4, config.strength), 
                        Math.min(config.strength, 10)) 
                },
                maxBranchDensity: 10.5,
                minAngle: function() {
                    return -220 - game.rnd.integerInRange(-10, 90);
                },
                maxAngle: function() {
                    return 40 + game.rnd.integerInRange(-10, 90);
                },
            },
            grow: {

            },
            jointDynamics: {
                angle_rate_rate: function(config) {
                    return Helper.randomNormal(0,1/(1+0.5*config.strength*Math.sqrt(config.year)));
                },
                targetAngle: -90,
                targetAngleDeadZone: 180,
                targetAngleGain: 0.99,
                originalAngleGain: 0.9,
                originalAngleAdaptionGain: 0.999,
            }
        }

    }
    Genome.prototype.constructor = Genome;
    return Genome;
});