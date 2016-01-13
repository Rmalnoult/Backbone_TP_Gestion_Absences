var StudentCollection = Backbone.Collection.extend({

	localStorage: new Backbone.LocalStorage("StudentCollection"),

	// On lui passe un modèle de référence
	model: Student,

});
