(function($, undefined) {

    //Creates the options for the slides
    var steps = {
        "#title": {
            x: 300, y: -600, scale: 5, rotate: { x: 90 }
        },
        "#definition": {
            x: 3200, y: -1100, scale: 3, rotate: { y: -90 }
        },
        "#merits": {
            x: 2200, y: -1100, scale: 1
        },
        "#demerits": {
            x: 2200, y: -600, z: 200, scale: 1
        },
        "#cat-wtf": {
            x: 3200, y: -200, z: 400, scale: 2, rotate: { x: -90 }
        },
        "#hoisting": {
            x: 3200, y: 400, z: 170, scale: 1
        },
        "#hoisting-example": {
            x: 4200, y: 0, z: 380, scale: 1, rotate: { z: 90 }
        },
        "#object-literal": {
            x: 4200, y: 0, scale: 1, rotate: { x: -90, y: -90 }
        },
        "#creating-module": {
            x: 4200, y: 1100, scale: 2, rotate: { x: -90 }
        },
        "#privacy": {
            x: 4200, y: 2400, scale: 2
        },
        "#global-import": {
            x: 4200, y: 2400, scale: 2, z: 700, rotate: { y: 360 }
        },
        "#module-export": {
            x: 1000, y: 2000, scale: 3, z: 1000, rotate: { y: 270, z: 90 }
        },
        "#augmentation": {
            x: 2200, y: 2000, scale: 3, rotate: { y: 90, z: 90 }
        },
        "#loose-augmentation": {
            x: 2200, y: 2000, scale: 2, rotate: { y: -180, z: 90 }
        },
        "#tight-augmentation": {
            x: 4200, y: 3500, scale: 2, rotate: { x: -90, z: 270 }
        },
        "#revealing-module-1": {
            x: 5800, y: 2500, scale: 1
        },
        "#revealing-module-2": {
            x: 5800, y: 3100, scale: 1, rotate: { y: 90 }
        },
        "#questions": {
            x: 7000, y: 800, scale: 4, rotate: { y: 65, z: -90 }
        },
        "#thank-you": {
            x: 5800, y: 700, z: 700, scale: 4
        }
    };

    utils
    .addHintMessage()
    .initDataAttributes(steps, ".skip-counter")
    .initPrettify()
    .initImpress("#impress", function($impress) {
        $impress.on("impress:stepenter", function(e) {
            $("#global-import").toggle(e.target.id !== "privacy");
        });
    });

}(jQuery));
