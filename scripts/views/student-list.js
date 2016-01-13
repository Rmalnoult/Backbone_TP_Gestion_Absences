var StudentListView = Backbone.View.extend({

	el: '#app',

	events: {
		'submit form#addStudent': 'addStudent',
		'change .student input[type="radio"]': 'checkStudent',
	},

	initialize : function () {

		// On lie la collection à la vue en instanciant new StudentCollection.
		this.StudentCollection = new StudentCollection();
		this.StudentCollection.fetch();

		this.render();
	},

	addStudent: function (e) {
		e.preventDefault();
		var $form     = $(e.currentTarget);
		var lastname  = $form.find('.student-lastname').val();
		var firstname = $form.find('.student-firstname').val();
		var avatar    = $form.find('.student-avatar').val();

		// Avec ces données, on créé une nouvel instance du modèle
		var student = new Student({
			firstname: firstname,
			lastname: lastname,
			avatar: avatar,
		});
		// Apply a unique identifier to our model
		student.set({ cid: student.cid });

		// On ajoute ce modèle à la collection
		this.StudentCollection.add(student);

		// Sauvegarde en localStorage
		student.save();

		this.render();
	},

	checkStudent: function (e) {

		var $input     = $(e.currentTarget);
		var inputValue = $input.val();
		// get the student's unique id store in data-cid attribute
		var cid        = $input.parents('div.student').attr('data-cid');
		var student    = this.StudentCollection.findWhere({ cid: cid });

		if (student) {
			student.set({
				present: inputValue == 'present' ? true : false,
			});
			student.save();
		}

		this.updateCounters();

	},

	getStudentTemplate : function(student) {

		var nicename = '<h2>'+student.firstname+' '+student.lastname+'</h2>';
		var avatar   = '<img class="col-md-6 pull-left avatar" src="'+student.avatar+'" />';

		var studentTemplate = '\
			<div class="panel panel-default col-md-4 student" data-cid="'+student.cid+'">\
				<div class="panel-body">\
					'+avatar+'\
					'+nicename+'\
					<form>\
						<label>Présent</label>\
						<input '+ (student.present ? 'checked' : '') +' type="radio" class="student-present" name="student" value="present" />\
						<label>Absent</label>\
						<input '+ (student.present ? '' : 'checked') +' type="radio" class="student-absent" name="student" value="absent" />\
					</form>\
				</div>\
			</div>\
		';

		// On retourne la string convertie en html grâce à jQuery
		return $(studentTemplate);

	},

	updateCounters: function () {

		var students        = this.StudentCollection.toJSON();
		var absent_students = this.StudentCollection.where({
			present: false,
		});

		// nombre total d'étudiants
		$('.student-count').empty();
		$('.student-count').append(students.length);

		// nombre d'étudiants absents
		$('.student-absent-count').empty();
		$('.student-absent-count').append(absent_students.length);

		// nombre d'étudiants présents
		$('.student-present-count').empty();
		$('.student-present-count').append(students.length - absent_students.length);

	},

	render: function () {
		// On récupère l'endroit où l'on va templater les étudiants
		var $studentList = this.$('.student-list');
		// On récupère tous les étudiants de la collection
		var students     = this.StudentCollection.toJSON();

		$studentList.empty();

		for (var i = 0; i < students.length; i++) {
			var student = students[i];
			var $studentTemplate = this.getStudentTemplate(student);

			$studentList.append($studentTemplate);
		}

		this.updateCounters();
	},
});
