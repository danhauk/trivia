// set total number of questions to ask
var total_questions = 5;

// general var resets
var current_question_num = 0;
var score = 0;

var questions = [];
var current_question = null;

function display_question() {
	// reset question card display
	$('.question').removeClass( 'slideInRight' ).addClass( 'slideOutLeft' );

	// check if we have questions to display
	if ( current_question_num < total_questions ) {
		current_question = questions[current_question_num];
		
		// add slight delay in showing new question
		// to make sure we don't see it change
		setTimeout(function() {
			// reset buttons and answer
			$('.answer-display').removeClass( 'correct incorrect bounceIn' ).hide();
			$('.button').removeClass( 'slideOutLeft slideOutRight' );

			// show next question
			$('.question-text').html( current_question.question );
		}, 500);
	}
	else {
		end_quiz();
	}

	// slide out current question and display new question
	setTimeout(function() {
		$('.question').removeClass( 'slideOutLeft' ).addClass( 'slideInRight' ).show();
	}, 500);
}

function answer_question(question, answer) {
	var correct_answer = question.answer;
	var is_correct = null;

	if ( answer == correct_answer ) {
		score++;
		is_correct = true;
	}
	else {
		is_correct = false;
	}

	display_answer( is_correct );

	current_question_num++;
}

function display_answer( is_correct ) {
	if ( is_correct ) {
		$('.answer-display').addClass( 'correct' ).html( 'Correct!' );
	}
	else {
		$('.answer-display').addClass( 'incorrect' ).html( 'Wrong!' );
	}

	// animate that ish for funzies
	$('.button-true').addClass( 'slideOutLeft' );
	$('.button-false').addClass( 'slideOutRight' );
	$('.answer-display').addClass( 'bounceIn' ).show();

	setTimeout( display_question, 1500 );
}

function end_quiz() {
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

	// add a slight delay so we don't see the text change
	setTimeout(function() {
		$('.question').addClass( 'end' ).html( '<h1>That\'s all the questions!</h1><h2>You scored ' + score + ' out of ' + total_questions + '</h2><h3>' + final_message + '</h3>' );
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
	$('.button').click(function() {
		var answer = $(this).data('answer');
		var question = questions[current_question_num];

		answer_question( question, answer );
	});
});