import { renderMath } from '/js/shared.js';

const quizQuestions = [
	{
		category: 'Algebra',
		catColor: '#E91E63',
		question: 'Solve for x:',
		formula: '2x + 5 = 13',
		options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
		correct: 1,
		explanation: '2x + 5 = 13 \\implies 2x = 8 \\implies x = 4'
	},
	{
		category: 'Geometry',
		catColor: '#00897B',
		question: 'What is the area of a circle with radius 5?',
		formula: 'A = \\pi r^2',
		options: ['10\\pi', '25\\pi', '50\\pi', '5\\pi'],
		correct: 1,
		explanation: 'A = \\pi \\cdot 5^2 = 25\\pi \\approx 78.54'
	},
	{
		category: 'Statistics',
		catColor: '#F57C00',
		question: 'Find the mean of the data set:',
		formula: '\\{4, 8, 6, 5, 7\\}',
		options: ['5', '6', '7', '8'],
		correct: 1,
		explanation: '\\bar{x} = \\frac{4+8+6+5+7}{5} = \\frac{30}{5} = 6'
	},
	{
		category: 'Probability',
		catColor: '#7B1FA2',
		question: 'A fair six-sided die is rolled once. What is the probability of getting an even number?',
		formula: 'P(\\text{even}) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}',
		options: ['\\frac{1}{6}', '\\frac{1}{3}', '\\frac{1}{2}', '\\frac{2}{3}'],
		correct: 2,
		explanation: '\\text{Even numbers: } \\{2,4,6\\} \\implies P = \\frac{3}{6} = \\frac{1}{2}'
	},
	{
		category: 'Algebra',
		catColor: '#E91E63',
		question: 'Expand the product:',
		formula: '(x + 3)(x - 2)',
		options: ['x^2 + x - 6', 'x^2 - x - 6', 'x^2 + 5x - 6', 'x^2 - 5x + 6'],
		correct: 0,
		explanation: '(x+3)(x-2) = x^2 - 2x + 3x - 6 = x^2 + x - 6'
	},
	{
		category: 'Geometry',
		catColor: '#00897B',
		question: 'In a right triangle with legs of length 3 and 4, what is the length of the hypotenuse?',
		formula: 'c = \\sqrt{a^2 + b^2}',
		options: ['6', '7', '5', '8'],
		correct: 2,
		explanation: 'c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5'
	},
	{
		category: 'Statistics',
		catColor: '#F57C00',
		question: 'What is the median of this data set?',
		formula: '\\{2, 7, 3, 9, 5\\}',
		options: ['3', '5', '7', '9'],
		correct: 1,
		explanation: '\\text{Sorted: } \\{2,3,5,7,9\\} \\implies \\text{Median (middle)} = 5'
	},
	{
		category: 'Probability',
		catColor: '#7B1FA2',
		question: 'A bag contains 3 red marbles and 7 blue marbles. If one marble is drawn at random, what is P(red)?',
		formula: 'P(\\text{red}) = \\frac{\\text{red marbles}}{\\text{total marbles}}',
		options: ['\\frac{3}{7}', '\\frac{7}{10}', '\\frac{3}{10}', '\\frac{1}{3}'],
		correct: 2,
		explanation: 'P(\\text{red}) = \\frac{3}{3+7} = \\frac{3}{10}'
	}
];

let quizState = { current: 0, score: 0, answered: false };

function renderQuestion() {
	const question = quizQuestions[quizState.current];
	const index = quizState.current;
	const quizProgress = document.getElementById('quizProgress');
	const quizNum = document.getElementById('quizNum');
	const quizScore = document.getElementById('quizScore');
	const quizCategory = document.getElementById('quizCategory');
	const quizQuestion = document.getElementById('quizQuestion');
	const quizFormula = document.getElementById('quizFormula');
	const quizOptions = document.getElementById('quizOptions');
	const quizFeedback = document.getElementById('quizFeedback');
	const quizNext = document.getElementById('quizNext');

	if (quizProgress) quizProgress.style.width = `${(index / quizQuestions.length) * 100}%`;
	if (quizNum) quizNum.textContent = `Question ${index + 1} / ${quizQuestions.length}`;
	if (quizScore) quizScore.textContent = String(quizState.score);
	if (quizCategory) {
		quizCategory.textContent = question.category;
		quizCategory.style.background = `${question.catColor}15`;
		quizCategory.style.color = question.catColor;
	}
	if (quizQuestion) quizQuestion.textContent = question.question;
	renderMath(quizFormula, question.formula, true);

	if (quizOptions) {
		quizOptions.innerHTML = '';
		question.options.forEach((option, optionIndex) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'quiz-opt flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left';

			const label = document.createElement('span');
			label.className = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700';
			label.textContent = String.fromCharCode(65 + optionIndex);

			const optionText = document.createElement('span');
			optionText.className = 'font-mono text-sm text-slate-900';
			renderMath(optionText, option, false);

			button.append(label, optionText);
			button.addEventListener('click', () => selectAnswer(optionIndex));
			quizOptions.appendChild(button);
		});
	}

	if (quizFeedback) quizFeedback.classList.add('hidden');
	if (quizNext) quizNext.classList.add('hidden');
	quizState.answered = false;
}

function selectAnswer(index) {
	if (quizState.answered) return;
	quizState.answered = true;

	const question = quizQuestions[quizState.current];
	const options = document.querySelectorAll('.quiz-opt');
	options.forEach((option) => option.classList.add('disabled'));

	options[question.correct]?.classList.add('correct');
	if (index !== question.correct) {
		options[index]?.classList.add('wrong');
	} else {
		quizState.score += 1;
		const quizScore = document.getElementById('quizScore');
		if (quizScore) quizScore.textContent = String(quizState.score);
	}

	const quizFeedback = document.getElementById('quizFeedback');
	if (quizFeedback) {
		quizFeedback.classList.remove('hidden');
		quizFeedback.className = index === question.correct
			? 'mb-6 rounded-xl border border-green-200 bg-green-50 p-5'
			: 'mb-6 rounded-xl border border-red-200 bg-red-50 p-5';

		const titleColor = index === question.correct ? 'text-emerald-700' : 'text-rose-700';
		const icon = index === question.correct ? '<i class="fas fa-check-circle mr-2 text-emerald-500"></i>' : '<i class="fas fa-times-circle mr-2 text-rose-500"></i>';
		quizFeedback.innerHTML = `
			<div class="${titleColor} mb-2 font-bold">${icon}${index === question.correct ? 'Correct!' : 'Not quite.'}</div>
			<div class="mb-2 text-sm text-slate-600">Step-by-step solution:</div>
			<div id="fbExplanation" class="rounded-lg bg-white p-3"></div>
		`;
		const fbExplanation = document.getElementById('fbExplanation');
		if (fbExplanation) {
			// replace inner content with a plain-text container to avoid leftover KaTeX markup
			fbExplanation.innerHTML = '<div class="explanation-text" style="white-space:normal; word-break:break-word; line-height:1.5;"></div>';
			const inner = fbExplanation.querySelector('.explanation-text');
			if (inner) {
				if (question.explanation.includes('\\')) {
					renderMath(inner, question.explanation, true);
				} else {
					inner.textContent = question.explanation;
				}
			}
		}
	}

	const quizNext = document.getElementById('quizNext');
	if (quizNext) {
		quizNext.classList.remove('hidden');
		quizNext.innerHTML = quizState.current < quizQuestions.length - 1
			? 'Next Question <i class="fas fa-arrow-right ml-2"></i>'
			: 'See Results <i class="fas fa-trophy ml-2"></i>';
	}
}

function nextQuestion() {
	if (quizState.current < quizQuestions.length - 1) {
		quizState.current += 1;
		renderQuestion();
		return;
	}

	const quizProgress = document.getElementById('quizProgress');
	const quizComplete = document.getElementById('quizComplete');
	const finalScore = document.getElementById('finalScore');
	const finalGrade = document.getElementById('finalGrade');

	if (quizProgress) quizProgress.style.width = '100%';
	if (quizComplete) {
		quizComplete.classList.remove('hidden');
		quizComplete.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	const percentage = Math.round((quizState.score / quizQuestions.length) * 100);
	if (finalScore) finalScore.textContent = `You scored ${quizState.score} out of ${quizQuestions.length} (${percentage}%)`;
	const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';
	const gradeColor = percentage >= 80 ? 'text-emerald-500' : percentage >= 60 ? 'text-amber-500' : 'text-rose-500';
	if (finalGrade) {
		finalGrade.textContent = grade;
		finalGrade.className = `mt-6 text-5xl font-extrabold ${gradeColor}`;
	}
}

function restartQuiz() {
	quizState = { current: 0, score: 0, answered: false };
	document.getElementById('quizComplete')?.classList.add('hidden');
	renderQuestion();
	document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
}

window.nextQuestion = nextQuestion;
window.restartQuiz = restartQuiz;
renderQuestion();
