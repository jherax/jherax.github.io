var MODULE = (function() {
	var date = new Date().toISOString();
  	console.log("%c>> MODULE loaded > " + date, "color: orangered");
	return {
	    "name": "module.js",
	    "date": date
	};
}());