var language = (function (language, $, undefined) {
	language.english = {
		culture: "en",
		mainTitle: 'JSU Library API Reference and examples',
		inputTypeText: '<nobr>It is considered <em>inputType.isText</em> any of the following DOM elements</nobr>',
		asideTheme: 'This page was generated by <a href="https://pages.github.com" target="_blank">GitHub Pages</a> using the Architect theme by <a href="https://twitter.com/jasonlong" target="_blank">Jason Long</a>.',
		asideBlogs: 'Recomended blogs:',
		asideArticles: 'Recomended articles:',
		asidePractices: 'Tips for Good practices'
	};
	language.spanish = {
		culture: "es",
		mainTitle: 'JSU Library: Documentación y ejemplos',
		inputTypeText: '<nobr>Se considera <em>inputType.isText</em> a cualquiera de los siguientes elementos DOM</nobr>',
		asideTheme: 'Esta página fue generada por <a href="https://pages.github.com" target="_blank">GitHub Pages</a> usando el tema Architect de <a href="https://twitter.com/jasonlong" target="_blank">Jason Long</a>.',
		asideBlogs: 'Blogs recomendados:',
		asideArticles: 'Artículos recomendados:',
		asidePractices: 'Tips de Buenas prácticas'
	};
	language.set = function (lang) {
		if (!language[lang]) return;
		var _lang = language[lang];
		$("html").attr("lang", _lang.culture);
		$("#mainTitle").text(_lang.mainTitle);
		$("#asideTheme").html(_lang.asideTheme);
		$("#asideBlogs").text(_lang.asideBlogs);
		$("#asideArticles").text(_lang.asideArticles);
		$("#asidePractices").text(_lang.asidePractices);
		$(".inputTypeText").html(_lang.inputTypeText);
	};
	return language;
}(language || {}, jQuery));
