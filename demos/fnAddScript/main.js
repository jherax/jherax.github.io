var load = (function (undefined) {

    //carga el script asíncronamente,
    //crea el elemento <script> y
    //es insertado antes de jherax.js
    function tagAsync(e) {
      setTimeout(function() {
        printBegin("1.");
        if(!window.MODULE) jsu.fnAddScript("module.js");
        console.log("1. Main stack > MODULE:", window.MODULE);
      }, 100);
    }

    //carga el script asíncronamente,
    //es cargado silenciosamente por $.ajax y
    //reacciona cuando el script ha terminado de cargar
    //mediante el callback "onload"
    function inMemoryAsync(e) {
      setTimeout(function() {
        if(window.MODULE) window.MODULE = undefined;
        printBegin("2.");
        jsu.fnAddScript({
          src: "module.js",
          silent: true,
          onload: function() {
            console.log("2. Async callback > MODULE:", window.MODULE);
          }
        });
        console.log("2. Main stack > MODULE:", window.MODULE);
      }, 100);
    }

    //carga el script síncronamente,
    //es cargado silenciosamente por $.ajax y
    //reacciona cuando el script ha terminado de cargar,
    //mediante el método diferido .done() del objeto jqXHR.
    function inMemorySync(e) {
      setTimeout(function() {
        if(window.MODULE) window.MODULE = undefined;
        printBegin("3.");
        jsu.fnAddScript({
          src: "module.js",
          async: false
        }).done(function() {
            console.log("3. Sync callback > MODULE:", window.MODULE);
        });
        console.log("3. Main stack > MODULE:", window.MODULE);
      }, 100);
    }

    //imprime el comienzo de la operación
    function printBegin(step) {
      console.log(step + " Main stack > start: " + new Date().toISOString());
    }

    //elemento DOM del botón
    var button = document.getElementById("load");

    //asigna el event handler del evento click
    function handler (fnCallback) {
      button.onclick = fnCallback;
      return button;
    }

    return {
      tagAsync: function() { return handler(tagAsync); },
      inMemoryAsync: function() { return handler(inMemoryAsync); },
      inMemorySync: function() { return handler(inMemorySync); }
    };

  }());

load.tagAsync();