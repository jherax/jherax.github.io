var setHandler = (function (context, $, jsu, undefined) {

    //elemento DOM al cual se le agregará el
    //handler del evento click
    var _button;

    //crea el elemento <script> para cargar
    //el archivo, lo inserta antes de main.js
    //y ejecuta el callback "onload" cuando
    //el script ha sido cargado y ejecutado
    //https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/
    function scriptTag (e) {
      setTimeout(function() {
        printBegin("1.");
        //asegura que MODULE no exista
        if(context.MODULE) MODULE = undefined;
        jsu.addScript({
          src: "module.js",
          before: "main.js",
          createTag: true,
          onload: function() {
            console.log("1. onload callback > MODULE:", MODULE);
          }
        });
        console.log("1. Main stack > MODULE:", context.MODULE);
      }, 100);
    }

    //carga el archivo asíncronamente mediante $.ajax,
    //y ejecuta el método ".done()" del objeto jqXHR retornado
    function ajaxAsync (e) {
      setTimeout(function() {
        //asegura que MODULE no exista
        if(context.MODULE) MODULE = undefined;
        printBegin("2.");
        jsu.addScript("module.js").done(function() {
          console.log("2. Async promise > MODULE:", MODULE);
        });
        console.log("2. Main stack > MODULE:", context.MODULE);
      }, 100);
    }

    //carga el archivo de forma sincrónica mediante $.ajax,
    //y ejecuta el método ".done()" del objeto jqXHR retornado
    function ajaxSync (e) {
      setTimeout(function() {
        //asegura que MODULE no exista
        if(context.MODULE) MODULE = undefined;
        printBegin("3.");
        jsu.addScript({
          src: "module.js",
          async: false
        }).done(function() {
            console.log("3. Sync promise > MODULE:", MODULE);
        });
        console.log("3. Main stack > MODULE:", context.MODULE);
      }, 100);
    }

    //imprime el mensaje en la consola
    function printBegin (step) {
      console.log("%c" + step + " Main stack > start: " +
        new Date().toISOString(), "color: green");
    }

    //asigna el event handler del evento click
    function handler (fnCallback) {
      _button.onclick = fnCallback;
      return _button;
    }

    //retorna currying function
    return function (selector) {
      _button = $(selector).get(0);
      return {
        "scriptTag": function() { return handler(scriptTag); },
        "ajaxAsync": function() { return handler(ajaxAsync); },
        "ajaxSync": function() { return handler(ajaxSync); }
      };
    };

  }(window, jQuery, jsu));

var buttonHandler = setHandler("#load");
buttonHandler.scriptTag();