(function ($, jsu, language, undefined) {
  //Document ready
  $(function() {
    var lang = jsu.fnGetQueryToString("lang") || "english";
    $("#select-language").val(lang).trigger("change");
  });
  //Sets the language setting
  $(document).on("change", "#select-language", function() {
    language.set(this.value);
    //location.search = "?lang=" + this.value;
    $("#main-content").load("views/" + this.value + ".html", function (response, status, xhr) {
        if (location.hash != "") {
          location.hash = location.hash + "@";
          location.hash = location.hash.replace("@", "");
        }
        $(".add-top-link").append('<a class="cbox-close" href="#">↑ top</a>');
        $(".add-methods-link").append('<a class="cbox-close" href="#list-of-methods">↑ list</a>');
        $(".add-jquery-link").append('<a class="cbox-close" href="#jquery-extensions">↑ list</a>');
        var canOpen = true;
        $("[data-mcp]").colorbox({
          innerWidth: 397, innerHeight: 177,
          href: "https://www.mcpvirtualbusinesscard.com/VBCServer/jherax/card",
          iframe: true,
          fastIframe: true,
          closeButton: false,
          overlayClose: false,
          scrolling: false,
          arrowKey: false,
          loop: false,
          onOpen: function() { canOpen = false; },
          onLoad: function() { $("#cboxContent").addClass("loader"); $("#circleG").fnCenter({of: "#colorbox"}); },
          onComplete: function() {
            $("#cboxLoadedContent iframe").bind("load", function() {
              $("#cboxContent").removeClass("loader");
              $("#circleG").appendTo("#loader-iframe");
            });
          },
          onClosed: function() { canOpen = true; }
        }).on("click", function() { return canOpen; });
        $('<span class="cbox-close">').text("X").prependTo("#colorbox").on("click", function() {
          $.colorbox.close();
        });   
    });
  });
})(jQuery, jsu, window.language);
