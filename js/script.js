// set total number of questions to ask
var total_questions = 5;

// general var resets
var current_question_num = 0;
var score = 0;

var questions = [];
var current_question = null;

// load a question
function display_question() {
	// reset display options
	$('.question-text').fadeOut();
	$('.answer-display').slideUp(100).removeClass( 'correct incorrect' );
	$('.button').removeClass( 'selected disabled' );

	if ( current_question_num < total_questions ) {
		current_question = questions[current_question_num];
		
		setTimeout(function() {
			$('.question-text').html( current_question.question ).add('.question').fadeIn();
		}, 300);
	}
	else {
		end_quiz();
	}
}

// answer question
function answer_question(question, answer) {
	var correct_answer = question.answer;

	if ( answer == correct_answer ) {
		score++;
		var is_correct = 'Correct!';
		$('.answer-display').addClass( 'correct' );
	}
	else {
		var is_correct = 'Wrong!';
		$('.answer-display').addClass( 'incorrect' );
	}

	$('.answer-display').html( is_correct ).slideDown(100);

	current_question_num++;

	setTimeout(function() {
		display_question();
	}, 1500);
}

// end quiz
function end_quiz() {
	$('.question').fadeOut();

	var final_message = '';
	var grade_f = total_questions * 0.25;
	var grade_c = total_questions * 0.50;
	var grade_a = total_questions * 0.75;

	if ( score >= grade_a ) {
		final_message = 'Fantastic job! You know your stuff.';
	}
	else if ( score >= grade_c ) {
		final_message = 'Not too shabby, but there\'s still room for improvement.';
	}
	else if ( score >= grade_f ) {
		final_message = 'Nice try, but I think you can do better';
	}
	else {
		final_message = 'Were you even trying?';
	}

	setTimeout(function() {
		$('.question').addClass( 'end' ).html( '<h1>That\'s all the questions!</h1><h2>You scored ' + score + ' out of ' + total_questions + '</h2><h3>' + final_message + '</h3>' );
		$('.question').fadeIn();
	}, 500);
}

// shuffle questions
// source link:
// http://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize
function shuffle(questions) {
	var num_questions = questions.length;

	for( var n = 0; n < num_questions - 1; n++ ) {
		var k = n + Math.floor(Math.random() * (num_questions - n));

        var temp = questions[k];
        questions[k] = questions[n];
        questions[n] = temp;
	}
}

$(document).ready(function() {
	// get list of questions and display first one
	$.getJSON('js/questions.json', function(data) {
		$.each(data, function(index, item) {
			questions.push(item);
		});
	}).done(function() {
		shuffle(questions);

		// remove extra questions
		questions = questions.slice(0, total_questions);

		// display first question
		display_question();
	});

	// listen for answer button clicks
	$('.button-answer').click(function() {
		var answer = $(this).data('answer');
		var question = questions[current_question_num];

		$(this).addClass( 'selected' ).siblings().addClass( 'disabled' );

		answer_question( question, answer );
	});
});