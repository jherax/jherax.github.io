(function ($, jsu, language, undefined) {

  //Settings for colorbox
  var settings1, settings2;
  var settings = {
    closeButton: false,
    overlayClose: false,
    scrolling: false,
    arrowKey: false,
    loop: false
  };

  //loading animation
  var circleG = 
    '<div id="circleG">' +
      '<div id="circleG_1" class="circleG"></div>' +
      '<div id="circleG_2" class="circleG"></div>' +
      '<div id="circleG_3" class="circleG"></div>' +
    '</div>';

  //Document ready
  $(function() {
    var lang = jsu.fnGetQueryToString("lang") || "english";
    $("#select-language").val(lang).trigger("change");
  });//end on.ready

  //Creates the handler for the inputType:text window
  $(document).on("click", ".open-window", function(e) {
    e.preventDefault();
    $.colorbox(settings1 = settings1 || $.extend({
      html: $("#inputTypeText").html(),
      transition: "fade",
      open: true,
      onOpen: function() {
        var o = $("body").css("overflow");
        $("body").data("overflow", o).css("overflow", "hidden");
        $(".bg-fixed").fadeIn();
      },
      onCleanup: function() {
        $(".bg-fixed").fadeOut();
      },
      onClosed: function() {
        var o = $("body").data("overflow");
        $("body").css("overflow", o);
      }
    }, settings));
  });//end on.click

  //Sets the language setting
  $(document).on("change", "#select-language", function() {
    language.set(this.value);
    //location.search = "?lang=" + this.value;
    
    $("#main-content").load("views/" + this.value + ".html", function (response, status, xhr) {
        var hash, canOpen = true;
        if (location.hash != "") {
          hash = location.hash;
          location.hash = "";
          location.hash = hash;
        }
        $(".add-top-link").append('<a class="cbox-close" href="#">↑ top</a>');
        $(".add-methods-link").append('<a class="cbox-close" href="#list-of-methods">↑ list</a>');
        $(".add-jquery-link").append('<a class="cbox-close" href="#jquery-extensions">↑ list</a>');

        //loads the iframe with the virtual business card
        $("[data-mcp]").colorbox(settings2 = settings2 || $.extend({
          href: "https://www.mcpvirtualbusinesscard.com/VBCServer/jherax/card",
          transition: "elastic",
          innerWidth: 397,
          innerHeight: 177,
          iframe: true,
          fastIframe: true,
          onOpen: function() { canOpen = false; },
          onLoad: function() {
            $("#cboxContent").addClass("loader");
            $(circleG).appendTo(jsu.wrapper).fnCenter({of: "#colorbox"});
          },
          onComplete: function() {
            $("#cboxLoadedContent iframe").bind("load", function() {
              $("#cboxContent").removeClass("loader");
              $("#circleG").remove();
            });
          },
          onClosed: function() { canOpen = true; }
        }, settings)).on("click", function() { return canOpen; });

        //Prepend the span to the colorbox window
        $('<span class="cbox-close">').text("X").prependTo("#colorbox").on("click", function() {
          $.colorbox.close();
        });

    });//end $.load
  });//end on.change

})(jQuery, jsu, window.language);
