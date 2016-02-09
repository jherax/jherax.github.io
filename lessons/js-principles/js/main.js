(function($, undefined) {

	//Creates the options for the slides
	var steps = {
        "#title": {
            x: -1000, y: -1500, scale: 5, rotate: { x: 90 }
        },
        "#principles": {
            x: -1500, y: 500, scale: 2, rotate: { y: -180, z: 90 }
        },
        "#dry": {
            x: -700, y: 500, z: 220, rotate: { y: -180, z: 90 }
        },
        "#dry-eg1": {
            x: -700, y: 1700, z: -380, rotate: { y: -180, z: 90 }
        },
        "#dry-eg2": {
            x: -700, y: 1700, z: 420, rotate: { y: -180, z: 90, x: 180 }
        },
        "#dry-eg3": {
            x: -1000, y: 1700, rotate: { y: -90, z: 90, x: 180 }
        },
        "#abstraction": {
            x: -1400, y: 700, scale: 2, rotate: { x: 90 }
        },
        "#open-closed": {
            scale: 2, rotate: { x: 90, y: 90 }
        },
        "#single-resp": {
            x: 680, y: -710, z: -400
        },
        "#coupling": {
            y: -1500
        },
        "#case-eg1": {
            x: 1800, y: -1500
        },
        "#code-eg1": {
            x: 1800, y: -700, z: 160, rotate: { x: 90 }
        },
        "#splash": {
            x: 2900, y: -540
        },
        "#remarks": {
            x: 1800, y: -540, rotate: { x: 180 }
        },
        "#solution-1": {
            x: 1400, y: -2300, z: 500, scale: 1.4, rotate: { x: 270, y: 180 }
        },
        "#solution-2": {
            x: 2600, y: -1000, z: 500, scale: 1.4, rotate: { x: 270, y: 90 }
        },
        "#solution-3": {
            x: 1500, y: 300, z: 500, scale: 1.4, rotate: { x: 270 }
        },
        "#solution-4": {
            x: 1500, y: -500, z: -100, scale: 1.4, rotate: { x: 180 }
        },
        "#chuza": {
            x: 1200, y: 1400, scale: 1.6
        },
        "#thank-you": {
            x: 2400, y: 1300, scale: 3, z: 500
        }
  };
  
  utils
    .addHintMessage()
    .initDataAttributes(steps, ".skip-counter")
    .initPrettify()
    .initImpress("#impress");

})(jQuery);
