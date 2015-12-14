'use strict';

define(['phaser','helper'], function(Phaser,Helper) {
    function Genome(game) {
        this.game = game;
        // parameter class to hold all parameters relevant to generate a tree
        this.leaf_density_resolution = 80;
        this.branch_density_resolution = 80;
        this.x = 0.5;
        this.y = 0.90;
        this.grow_rate = 1000 / 25;
        this.grow_count = 15;
        this.slow_grow = 0.1;
        this.slow_grow_rate = 1000 / 2;
        this.leaf = {
            width_min: 16,
            width_max: 16,
            height_min: 16,
            height_max: 16,
            padding: 32,
            displacement_x: 0.6, // * leaf_width
            displacement_y: 0.6, // * leaf_height
            leafs_per_frame_min: 1, 
            leafs_per_frame_max: 20, 
            alpha: 0.6, 
            num_frames: 50, 
            colormap: "colormap_green",
            name: "green_leafs",
            emitter: {
                particles_max: 1000,
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
                start_explode: true,
                start_lifespan: function() {
                    return Math.max(100,Helper.randomNormal(500,500));
                },
                start_frequency: null,
                start_quantity: function(config) {
                    return (config.length / 60) + 1;
                }
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
        this.ground = {
            brush: {
                width_min: 8,
                width_max: 32,
                height_min: 8,
                height_max: 16,
                padding: 16,
                displacement_x: 0.6, // * leaf_width
                displacement_y: 0.6, // * leaf_height
                leafs_per_frame_min: 5, 
                leafs_per_frame_max: 10, 
                alpha: 0.6, 
                num_frames: 100, 
                colormap: "colormap",
                name: "ground_brush",
            },
            num: 5000,
            x_std: 1/8,
            y_std: 1/32,
            y_mean: -1/32,
        };
        this.trunk_color = 0x37220f;
        this.trunk_joint_size = 1;
        this.branch = {
            start_config: {
                angle: -90,
                length: 50,
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
                length: {
                    multiplicator: 8,
                    pheromoneIdx: 0,
                    pheromoneStd: 0.1,
                    yearDivider: 5,
                    dividerMin: 1,
                },
                strength: {
                    pheromoneIdx: 1, // 
                    subtract: 1,
                    dividerMin: 1,
                    yearDivider: 5,

                },
                childCondition: {
                    pheromoneIdx: 2, // used as probability
                    numChildrenMultiplicator: 0.7, // ~/numChildren used as probability
                    minYear: function() {
                        return game.rnd.integerInRange(1, 3);
                    },
                    minLengthPerChild: 5,
                    radius: 50,
                },
                splitCondition: {
                    minLength: 60,
                    probability: 0.4,
                },
                leafGrowProbability: 0.4,
                newLeaf: {
                    probabilityMultiplicator: 10,
                    maxStrength: function() {
                        return game.rnd.integerInRange(5, 15);
                    }
                }
            },
            jointDynamics: {
                angle_rate_rate: function(config) {
                    return Helper.randomNormal(0,1/(1+0.5*config.strength*Math.sqrt(config.year)));
                },
                targetAngle: -90,
                targetAngleDeadZone: 180,
                targetAngleGain: 0.99,
                longtermTargetAngleDifference: function() {
                    return Helper.randomNormal(0,45);
                },
                longtermTargetAngleDifferenceGain: 0.9,
                originalAngleGain: 0.9,
                originalAngleAdaptionGain: 0.999,
                angleRateZeroGain: 0.9
            },
            updatePheromoneLevel: {
                grow: 0.012,
                strength: 1.1,
                branch: 0.4,
            },
            randomSplitPosition: {
                minLength: 0.25,
                maxLength: 0.75,
            },
            _areParentsStrongEnough: {
                pheromoneIdx: 3, // 
                myWeightRandomMean: 3,
                myWeightRandomStd: 1,
            },
            _addRandomLeaf: {
                randomPointMin: 0,
                randomPointMax: 0.9,
                maxLeafDensity: 10
            }
        };
    }
    Genome.prototype.constructor = Genome;
    return Genome;
});