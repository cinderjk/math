import { observeRevealElements, renderMath } from '/js/shared.js';

function getBank() {
	const bankElement = document.getElementById('quiz-bank');
	if (!bankElement) return [];

	try {
		return JSON.parse(bankElement.textContent || '[]');
	} catch {
		return [];
	}
}

function getAlgebraKinds() {
	const kindsElement = document.getElementById('quiz-algebra-kinds');
	if (!kindsElement) return [];

	try {
		return JSON.parse(kindsElement.textContent || '[]');
	} catch {
		return [];
	}
}

function shuffle(items) {
	const output = [...items];
	for (let index = output.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[output[index], output[swapIndex]] = [output[swapIndex], output[index]];
	}
	return output;
}

function shuffleOptions(options, correctIndex) {
	const tagged = options.map((option, index) => ({ option, index }));
	shuffle(tagged);
	return {
		options: tagged.map((item) => item.option),
		correct: tagged.findIndex((item) => item.index === correctIndex)
	};
}

const state = {
	bank: getBank(),
	algebraKinds: getAlgebraKinds(),
	category: null,
	questions: [],
	current: 0,
	score: 0,
	answered: false
};

const elements = {
	grid: document.getElementById('quizCategoryGrid'),
	appShell: document.getElementById('quizAppShell'),
	complete: document.getElementById('quizComplete'),
	categoryBadge: document.getElementById('quizCategoryBadge'),
	questionCount: document.getElementById('quizQuestionCount'),
	progress: document.getElementById('quizProgress'),
	num: document.getElementById('quizNum'),
	score: document.getElementById('quizScore'),
	sidebarScore: document.getElementById('quizSidebarScore'),
	sidebarCategory: document.getElementById('quizSidebarCategory'),
	question: document.getElementById('quizQuestion'),
	formula: document.getElementById('quizFormula'),
	options: document.getElementById('quizOptions'),
	feedback: document.getElementById('quizFeedback'),
	next: document.getElementById('quizNext'),
	restartTop: document.getElementById('quizRestartTop'),
	restart: document.getElementById('quizRestart'),
	changeCategory: document.getElementById('quizChangeCategory'),
	chooseAnother: document.getElementById('quizChooseAnother'),
	resultTitle: document.getElementById('quizResultTitle'),
	finalScore: document.getElementById('finalScore'),
	finalGrade: document.getElementById('finalGrade')
};

function renderExplanation(node, explanation) {
	if (!node) return;

	node.innerHTML = '';
	const value = String(explanation ?? '');

	if (!value.includes('\\')) {
		node.textContent = value;
		return;
	}

	const hasNaturalLanguage = /[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(value);
	if (!hasNaturalLanguage) {
		renderMath(node, value, true);
		return;
	}

	const mathFragmentPattern = /(\\frac\{[^{}]*\}\{[^{}]*\}|\\sqrt\{[^{}]*\}|\\bar\{[^{}]*\}|\\text\{[^{}]*\}|\\\{[^}]*\\\}|\\[a-zA-Z]+(?:\{[^{}]*\})?|\^\{?\\circ\}?)/g;
	let cursor = 0;
	let match;

	while ((match = mathFragmentPattern.exec(value)) !== null) {
		const before = value.slice(cursor, match.index);
		if (before) {
			node.appendChild(document.createTextNode(before));
		}

		const inlineMath = document.createElement('span');
		renderMath(inlineMath, match[0], false);
		node.appendChild(inlineMath);
		cursor = match.index + match[0].length;
	}

	const tail = value.slice(cursor);
	if (tail) {
		node.appendChild(document.createTextNode(tail));
	}

	if (!node.childNodes.length) {
		node.textContent = value;
	}
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQuestion(question, formula, correctOption, wrongOptions, explanation) {
	const options = shuffle([correctOption, ...wrongOptions].filter(Boolean).slice(0, 4));
	return {
		question,
		formula,
		options,
		correct: options.indexOf(correctOption),
		explanation
	};
}

function buildAlgebraQuestion(kind) {
	switch (kind) {
		case 'linearEquation': {
			const a = randomInt(2, 7);
			const x = randomInt(2, 9);
			const b = randomInt(1, 12);
			const c = a * x + b;
			const wrongs = [`x = ${x - 3}`, `x = ${x - 1}`, `x = ${x + 1}`, `x = ${x + 2}`, `x = ${x + 3}`].filter((value) => value !== `x = ${x}` && !value.includes('x = 0'));
			return buildQuestion('Solve for x:', `${a}x + ${b} = ${c}`, `x = ${x}`, wrongs, `${a}x + ${b} = ${c} \\implies ${a}x = ${c - b} \\implies x = ${x}`);
		}
		case 'fractionEquation': {
			const divisor = randomInt(2, 6);
			const x = randomInt(2, 12);
			const c = x / divisor;
			const numerator = x;
			const wrongs = [`x = ${x - divisor}`, `x = ${x + divisor}`, `x = ${x * 2}`, `x = ${x + 3}`].filter((value) => value !== `x = ${x}`);
			return buildQuestion('Solve for x:', `\\frac{x}{${divisor}} = ${c}`, `x = ${x}`, wrongs, `\\frac{x}{${divisor}} = ${c} \\implies x = ${numerator}`);
		}
		case 'expandBinomial': {
			const m = randomInt(2, 6);
			const q = randomInt(1, 5);
			const formula = `(x + ${m})(x - ${q})`;
			const correct = `x^2 ${m - q >= 0 ? '+' : '-'} ${Math.abs(m - q)}x - ${m * q}`;
			const distractors = [
				`x^2 ${m + q >= 0 ? '+' : '-'} ${Math.abs(m + q)}x - ${m * q}`,
				`x^2 ${m - q >= 0 ? '+' : '-'} ${Math.abs(m - q)}x + ${m * q}`,
				`x^2 - ${m}x - ${q}`
			];
			return buildQuestion('Expand the product:', formula, correct, distractors, `${formula} = x^2 - ${q}x + ${m}x - ${m * q} = ${correct}`);
		}
		case 'factorQuadratic': {
			const a = randomInt(1, 4);
			const b = randomInt(2, 7);
			const c = a + b;
			const formula = `x^2 - ${c}x + ${a * b}`;
			const correct = `(x - ${a})(x - ${b})`;
			const distractors = [`(x - ${c})(x - 1)`, `(x + ${a})(x - ${b})`, `(x - ${a + 1})(x - ${b - 1})`];
			return buildQuestion('Factor completely:', formula, correct, distractors, `${formula} = ${correct}`);
		}
		case 'differenceOfSquares': {
			const n = randomInt(3, 12);
			return buildQuestion(
				'Factor the difference of squares:',
				`x^2 - ${n * n}`,
				`(x - ${n})(x + ${n})`,
				[`(x - ${n - 1})(x + ${n + 1})`, `(x + ${n})(x + ${n})`, `(x - ${n})(x - ${n})`],
				`x^2 - ${n * n} = x^2 - ${n}^2 = (x - ${n})(x + ${n})`
			);
		}
		case 'simplifyExpression': {
			const a = randomInt(2, 6);
			const b = randomInt(2, 8);
			const c = randomInt(1, 5);
			const d = randomInt(1, 6);
			const coeff = a * b - c;
			const constant = -a * d;
			const correct = `${coeff}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)}`;
			return buildQuestion(
				'Simplify the expression:',
				`${a}(${b}x - ${d}) - ${c}x`,
				correct,
				[` ${coeff + 1}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)}`.trim(), `${coeff}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant) + 1}`, `${coeff - 1}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)}`],
				`${a}(${b}x - ${d}) - ${c}x = ${a * b}x - ${a * d} - ${c}x = ${correct}`
			);
		}
		case 'evaluateFunction': {
			const value = randomInt(2, 8);
			return buildQuestion('Evaluate the function:', `f(x) = x^2, \\; f(${value}) = ?`, String(value * value), [String(value * value + 1), String(value * value - 1), String(value + value)], `f(${value}) = ${value}^2 = ${value * value}`);
		}
		case 'powerProduct': {
			const a = randomInt(2, 5);
			const b = randomInt(2, 5);
			return buildQuestion('Multiply the powers:', `x^${a} \\cdot x^${b}`, `x^${a + b}`, [`x^${a * b}`, `x^${Math.abs(a - b)}`, `2x^${a + b}`], `x^${a} \\cdot x^${b} = x^{${a} + ${b}} = x^${a + b}`);
		}
		case 'twoStepEquation': {
			const a = randomInt(2, 6);
			const x = randomInt(2, 10);
			const b = randomInt(2, 9);
			const c = a * x - b;
			return buildQuestion('Find the value of x:', `${a}x - ${b} = ${c}`, `x = ${x}`, [`x = ${x + 1}`, `x = ${x - 1}`, `x = ${x + 2}`], `${a}x - ${b} = ${c} \\implies ${a}x = ${c + b} \\implies x = ${x}`);
		}
		case 'distribution': {
			const a = randomInt(2, 6);
			const b = randomInt(2, 6);
			const c = randomInt(1, 5);
			const correct = `${a + c}x ${-a * b >= 0 ? '+' : '-'} ${Math.abs(a * b)}`;
			return buildQuestion('Simplify the expression:', `${a}(x - ${b}) + ${c}x`, correct, [`${a + c - 1}x ${-a * b >= 0 ? '+' : '-'} ${Math.abs(a * b)}`, `${a + c}x ${-a * b >= 0 ? '+' : '-'} ${Math.abs(a * b) + 1}`, `${a + c + 1}x ${-a * b >= 0 ? '+' : '-'} ${Math.abs(a * b)}`], `${a}(x - ${b}) + ${c}x = ${a}x - ${a * b} + ${c}x = ${correct}`);
		}
		default:
			return {
				question: 'Solve for x:',
				formula: 'x = 1',
				options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
				correct: 0,
				explanation: 'x = 1'
			};
	}
}

function buildAlgebraQuestions(count = 10) {
	const pool = shuffle(state.algebraKinds.length ? state.algebraKinds : [
		'linearEquation',
		'fractionEquation',
		'expandBinomial',
		'factorQuadratic',
		'differenceOfSquares',
		'simplifyExpression',
		'evaluateFunction',
		'powerProduct',
		'twoStepEquation',
		'distribution'
	]);
	const selectedKinds = Array.from({ length: count }, (_, index) => pool[index % pool.length]);

	return selectedKinds.map((kind) => {
		const built = buildAlgebraQuestion(kind);
		const correctText = built.options[built.correct] ?? built.options[0];
		const correctIndex = built.options.indexOf(correctText);
		return {
			...built,
			correct: correctIndex >= 0 ? correctIndex : 0
		};
	});
}

function pickCategory(categoryKey) {
	const category = state.bank.find((entry) => entry.key === categoryKey);
	if (!category) return;

	const sourceQuestions = category.key === 'algebra'
		? buildAlgebraQuestions(10)
		: shuffle(category.questions).slice(0, 10).map((question) => {
			const shuffledOptions = shuffleOptions(question.options, question.correct);
			return {
				...question,
				...shuffledOptions
			};
		});

	const shuffledQuestions = sourceQuestions.map((question) => {
		if (category.key === 'algebra') {
			const shuffled = shuffleOptions(question.options, question.correct);
			return {
				...question,
				...shuffled
			};
		}

		return question;
	});

	state.category = category;
	state.questions = shuffledQuestions;
	state.current = 0;
	state.score = 0;
	state.answered = false;

	elements.grid?.classList.add('hidden');
	elements.complete?.classList.add('hidden');
	elements.appShell?.classList.remove('hidden');

	if (elements.categoryBadge) {
		elements.categoryBadge.textContent = category.label;
		elements.categoryBadge.style.background = `${category.color}15`;
		elements.categoryBadge.style.color = category.color;
	}

	if (elements.questionCount) {
		elements.questionCount.textContent = `${shuffledQuestions.length} soal siap dimainkan`;
	}

	if (elements.sidebarCategory) elements.sidebarCategory.textContent = category.title;
	if (elements.resultTitle) elements.resultTitle.textContent = `Kategori ${category.label}`;

	renderQuestion();
	elements.appShell?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderQuestion() {
	const question = state.questions[state.current];
	if (!question) return;

	const total = state.questions.length;
	const progress = total ? (state.current / total) * 100 : 0;

	if (elements.progress) elements.progress.style.width = `${progress}%`;
	if (elements.num) elements.num.textContent = `Question ${state.current + 1} / ${total}`;
	if (elements.score) elements.score.textContent = String(state.score);
	if (elements.sidebarScore) elements.sidebarScore.textContent = String(state.score);
	if (elements.sidebarCategory) elements.sidebarCategory.textContent = state.category?.title ?? '-';
	if (elements.question) elements.question.textContent = question.question;
	renderMath(elements.formula, question.formula, true);

	if (elements.options) {
		elements.options.innerHTML = '';
		question.options.forEach((option, optionIndex) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'quiz-opt flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left shadow-sm';

			const label = document.createElement('span');
			label.className = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700';
			label.textContent = String.fromCharCode(65 + optionIndex);

			const optionText = document.createElement('span');
			optionText.className = 'font-mono text-sm text-slate-900';
			renderMath(optionText, option, false);

			button.append(label, optionText);
			button.addEventListener('click', () => selectAnswer(optionIndex));
			elements.options.appendChild(button);
		});
	}

	if (elements.feedback) {
		elements.feedback.classList.add('hidden');
		elements.feedback.innerHTML = '';
	}
	if (elements.next) elements.next.classList.add('hidden');
	state.answered = false;
}

function selectAnswer(index) {
	if (state.answered) return;
	state.answered = true;

	const question = state.questions[state.current];
	const optionButtons = document.querySelectorAll('.quiz-opt');
	optionButtons.forEach((button) => button.classList.add('disabled'));

	optionButtons[question.correct]?.classList.add('correct');
	if (index !== question.correct) {
		optionButtons[index]?.classList.add('wrong');
	} else {
		state.score += 1;
		if (elements.score) elements.score.textContent = String(state.score);
		if (elements.sidebarScore) elements.sidebarScore.textContent = String(state.score);
	}

	if (elements.feedback) {
		elements.feedback.classList.remove('hidden');
		elements.feedback.className = index === question.correct
			? 'mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5'
			: 'mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5';

		const titleColor = index === question.correct ? 'text-emerald-700' : 'text-rose-700';
		const icon = index === question.correct
			? '<i class="fas fa-check-circle mr-2 text-emerald-500"></i>'
			: '<i class="fas fa-times-circle mr-2 text-rose-500"></i>';

		elements.feedback.innerHTML = `
			<div class="${titleColor} mb-2 font-bold">${icon}${index === question.correct ? 'Benar!' : 'Belum tepat.'}</div>
			<div class="mb-2 text-sm text-slate-600">Pembahasan singkat:</div>
			<div id="quizExplanation" class="rounded-xl bg-white p-4"></div>
		`;
		renderExplanation(document.getElementById('quizExplanation'), question.explanation);
	}

	if (elements.next) {
		elements.next.classList.remove('hidden');
		elements.next.innerHTML = state.current < state.questions.length - 1
			? 'Next Question <i class="fas fa-arrow-right ml-2"></i>'
			: 'See Results <i class="fas fa-trophy ml-2"></i>';
	}
}

function finishQuiz() {
	const total = state.questions.length;
	const percentage = total ? Math.round((state.score / total) * 100) : 0;
	const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';
	const gradeColor = percentage >= 80 ? 'text-emerald-500' : percentage >= 60 ? 'text-amber-500' : 'text-rose-500';

	if (elements.progress) elements.progress.style.width = '100%';
	if (elements.complete) elements.complete.classList.remove('hidden');
	if (elements.finalScore) elements.finalScore.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
	if (elements.finalGrade) {
		elements.finalGrade.textContent = grade;
		elements.finalGrade.className = `mt-6 text-5xl font-extrabold ${gradeColor}`;
	}
	if (elements.complete) {
		elements.complete.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
}

function nextQuestion() {
	if (state.current < state.questions.length - 1) {
		state.current += 1;
		renderQuestion();
		return;
	}

	finishQuiz();
}

function resetCurrentCategory() {
	if (!state.category) return;
	pickCategory(state.category.key);
}

function showCategories() {
	state.category = null;
	state.questions = [];
	state.current = 0;
	state.score = 0;
	state.answered = false;

	elements.grid?.classList.remove('hidden');
	elements.appShell?.classList.add('hidden');
	elements.complete?.classList.add('hidden');
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-quiz-category]').forEach((button) => {
	button.addEventListener('click', () => {
		const categoryKey = button.getAttribute('data-quiz-category');
		if (categoryKey) pickCategory(categoryKey);
	});
});

elements.next?.addEventListener('click', nextQuestion);
elements.restart?.addEventListener('click', resetCurrentCategory);
elements.restartTop?.addEventListener('click', resetCurrentCategory);
elements.changeCategory?.addEventListener('click', showCategories);
elements.chooseAnother?.addEventListener('click', showCategories);

if (elements.progress) elements.progress.style.width = '0%';
observeRevealElements();