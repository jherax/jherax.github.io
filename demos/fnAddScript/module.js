var MODULE = (function() {
	var date = new Date();
	console.log(">> MODULE loaded > " + date.toISOString());
	return {
	    name: "jherax",
	    date: date
	};
}());