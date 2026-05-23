export type QuizQuestion = {
	question: string;
	formula: string;
	options: string[];
	correct: number;
	explanation: string;
};

export type QuizCategory = {
	key: string;
	label: string;
	title: string;
	description: string;
	color: string;
	questions: QuizQuestion[];
};

export type AlgebraQuestionKind =
	| 'linearEquation'
	| 'fractionEquation'
	| 'expandBinomial'
	| 'factorQuadratic'
	| 'differenceOfSquares'
	| 'simplifyExpression'
	| 'evaluateFunction'
	| 'powerProduct'
	| 'twoStepEquation'
	| 'distribution';

export const algebraQuestionKinds: AlgebraQuestionKind[] = [
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
];

const geometryQuestions: QuizQuestion[] = [
	{
		question: 'What is the area of a circle with radius 5?',
		formula: 'A = \\pi r^2',
		options: ['10\\pi', '25\\pi', '50\\pi', '5\\pi'],
		correct: 1,
		explanation: 'A = \\pi \cdot 5^2 = 25\\pi'
	},
	{
		question: 'A right triangle has legs of length 3 and 4. What is the hypotenuse?',
		formula: 'c = \\sqrt{a^2 + b^2}',
		options: ['4', '5', '6', '7'],
		correct: 1,
		explanation: 'c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5'
	},
	{
		question: 'What is the perimeter of a square with side length 7?',
		formula: 'P = 4s',
		options: ['14', '21', '24', '28'],
		correct: 3,
		explanation: 'P = 4 \cdot 7 = 28'
	},
	{
		question: 'What is the area of a triangle with base 12 and height 5?',
		formula: 'A = \\frac{1}{2}bh',
		options: ['12', '24', '30', '60'],
		correct: 2,
		explanation: 'A = \\frac{1}{2} \cdot 12 \cdot 5 = 30'
	},
	{
		question: 'The sum of the interior angles of a triangle is...',
		formula: '\\angle A + \\angle B + \\angle C = ?',
		options: ['180^\\circ', '90^\\circ', '270^\\circ', '360^\\circ'],
		correct: 0,
		explanation: 'The interior angles of any triangle add up to 180 degrees'
	},
	{
		question: 'What is the circumference of a circle with radius 6?',
		formula: 'C = 2\\pi r',
		options: ['6\\pi', '9\\pi', '12\\pi', '18\\pi'],
		correct: 2,
		explanation: 'C = 2\\pi \cdot 6 = 12\\pi'
	},
	{
		question: 'What is the volume of a rectangular prism with dimensions 2, 3, and 4?',
		formula: 'V = lwh',
		options: ['12', '18', '24', '30'],
		correct: 2,
		explanation: 'V = 2 \cdot 3 \cdot 4 = 24'
	},
	{
		question: 'An isosceles triangle has two equal angles of 50^\\circ. What is the third angle?',
		formula: '180^\\circ - 50^\\circ - 50^\\circ',
		options: ['60^\\circ', '70^\\circ', '75^\\circ', '80^\\circ'],
		correct: 3,
		explanation: '180^\\circ - 50^\\circ - 50^\\circ = 80^\\circ'
	},
	{
		question: 'What is the area of a trapezoid with bases 8 and 12 and height 5?',
		formula: 'A = \\frac{1}{2}(b_1 + b_2)h',
		options: ['30', '50', '60', '70'],
		correct: 1,
		explanation: 'A = \\frac{1}{2}(8 + 12) \cdot 5 = 50'
	},
	{
		question: 'A right triangle has hypotenuse 10 and one leg 6. What is the other leg?',
		formula: 'a^2 + b^2 = c^2',
		options: ['4', '8', '9', '12'],
		correct: 1,
		explanation: 'The missing leg is \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8'
	}
];

const statisticsQuestions: QuizQuestion[] = [
	{
		question: 'Find the mean of the data set:',
		formula: '\\{4, 8, 6, 5, 7\\}',
		options: ['5', '6', '7', '8'],
		correct: 1,
		explanation: '\\bar{x} = \\frac{4 + 8 + 6 + 5 + 7}{5} = \\frac{30}{5} = 6'
	},
	{
		question: 'Find the median of the data set:',
		formula: '\\{2, 7, 3, 9, 5\\}',
		options: ['3', '5', '7', '9'],
		correct: 1,
		explanation: 'Sorted data: \\{2, 3, 5, 7, 9\\}. The middle value is 5.'
	},
	{
		question: 'What is the mode of the data set?',
		formula: '\\{1, 2, 2, 3, 4\\}',
		options: ['1', '2', '3', '4'],
		correct: 1,
		explanation: 'The value 2 appears most often, so the mode is 2.'
	},
	{
		question: 'Find the range of the data set:',
		formula: '\\{10, 14, 9, 18\\}',
		options: ['6', '8', '9', '10'],
		correct: 2,
		explanation: 'Range = 18 - 9 = 9'
	},
	{
		question: 'Find the mean of the data set:',
		formula: '\\{3, 3, 4, 10\\}',
		options: ['5', '4', '6', '7'],
		correct: 0,
		explanation: '\\bar{x} = \\frac{3 + 3 + 4 + 10}{4} = \\frac{20}{4} = 5'
	},
	{
		question: 'Find the median of the data set:',
		formula: '\\{12, 15, 18, 20, 22, 25\\}',
		options: ['18', '20', '19', '21'],
		correct: 2,
		explanation: 'The middle two values are 18 and 20, so the median is 19.'
	},
	{
		question: 'Find the range of the data set:',
		formula: '\\{4, 11, 7, 9, 2\\}',
		options: ['6', '7', '8', '9'],
		correct: 3,
		explanation: 'Range = 11 - 2 = 9'
	},
	{
		question: 'What is the mode of the data set?',
		formula: '\\{5, 5, 6, 6, 6, 7\\}',
		options: ['5', '6', '7', '8'],
		correct: 1,
		explanation: 'The value 6 appears most often.'
	},
	{
		question: 'Find the mean of the data set:',
		formula: '\\{6, 8, 10, 12\\}',
		options: ['8', '9', '10', '11'],
		correct: 1,
		explanation: '\\bar{x} = \\frac{6 + 8 + 10 + 12}{4} = \\frac{36}{4} = 9'
	},
	{
		question: 'Find the median of the data set:',
		formula: '\\{1, 4, 6, 8, 9\\}',
		options: ['4', '5', '6', '7'],
		correct: 2,
		explanation: 'The middle value of the ordered list is 6.'
	}
];

const probabilityQuestions: QuizQuestion[] = [
	{
		question: 'A fair six-sided die is rolled once. What is the probability of getting an even number?',
		formula: 'P(\\text{even}) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}',
		options: ['\\frac{1}{6}', '\\frac{1}{3}', '\\frac{1}{2}', '\\frac{2}{3}'],
		correct: 2,
		explanation: 'Even outcomes are \\{2, 4, 6\\}, so P = \\frac{3}{6} = \\frac{1}{2}'
	},
	{
		question: 'What is the probability of getting heads on a fair coin?',
		formula: 'P(\\text{heads})',
		options: ['\\frac{1}{4}', '\\frac{1}{3}', '\\frac{1}{2}', '\\frac{2}{3}'],
		correct: 2,
		explanation: 'A fair coin has two equally likely outcomes, so the probability is \\frac{1}{2}'
	},
	{
		question: 'A bag contains 3 red marbles and 7 blue marbles. What is P(red)?',
		formula: 'P(\\text{red}) = \\frac{\\text{red marbles}}{\\text{total marbles}}',
		options: ['\\frac{3}{7}', '\\frac{7}{10}', '\\frac{3}{10}', '\\frac{1}{3}'],
		correct: 2,
		explanation: 'P(red) = \\frac{3}{3 + 7} = \\frac{3}{10}'
	},
	{
		question: 'Two fair coins are tossed. What is the probability of getting two heads?',
		formula: 'P(\\text{HH})',
		options: ['\\frac{1}{4}', '\\frac{1}{2}', '\\frac{3}{4}', '\\frac{1}{8}'],
		correct: 0,
		explanation: 'The outcomes are HH, HT, TH, TT, so P(HH) = \\frac{1}{4}'
	},
	{
		question: 'What is the probability of drawing an ace from a standard deck of 52 cards?',
		formula: 'P(\\text{ace})',
		options: ['\\frac{1}{52}', '\\frac{1}{13}', '\\frac{1}{4}', '\\frac{4}{13}'],
		correct: 1,
		explanation: 'There are 4 aces in 52 cards, so P = \\frac{4}{52} = \\frac{1}{13}'
	},
	{
		question: 'A die is rolled once. What is the probability of getting a number greater than 4?',
		formula: 'P(x > 4)',
		options: ['\\frac{1}{6}', '\\frac{1}{3}', '\\frac{1}{2}', '\\frac{2}{3}'],
		correct: 1,
		explanation: 'The favorable outcomes are \\{5, 6\\}, so P = \\frac{2}{6} = \\frac{1}{3}'
	},
	{
		question: 'A bag contains 2 green balls and 3 yellow balls. What is P(green)?',
		formula: 'P(\\text{green})',
		options: ['\\frac{1}{5}', '\\frac{2}{5}', '\\frac{3}{5}', '\\frac{4}{5}'],
		correct: 1,
		explanation: 'P(green) = \\frac{2}{2 + 3} = \\frac{2}{5}'
	},
	{
		question: 'A spinner has 5 equal sections and 2 of them are red. What is P(red)?',
		formula: 'P(\\text{red})',
		options: ['\\frac{1}{5}', '\\frac{2}{5}', '\\frac{3}{5}', '\\frac{4}{5}'],
		correct: 1,
		explanation: 'Two out of five sections are red, so P(red) = \\frac{2}{5}'
	},
	{
		question: 'What is the probability of drawing a king from a standard deck of 52 cards?',
		formula: 'P(\\text{king})',
		options: ['\\frac{1}{52}', '\\frac{1}{13}', '\\frac{1}{4}', '\\frac{4}{13}'],
		correct: 1,
		explanation: 'There are 4 kings in 52 cards, so P = \\frac{4}{52} = \\frac{1}{13}'
	},
	{
		question: 'A number from 1 to 10 is chosen at random. What is the probability of choosing a multiple of 3?',
		formula: 'P(\\text{multiple of } 3)',
		options: ['\\frac{1}{10}', '\\frac{1}{5}', '\\frac{3}{10}', '\\frac{1}{2}'],
		correct: 2,
		explanation: 'The multiples of 3 are 3, 6, and 9, so P = \\frac{3}{10}'
	}
];

export const quizCategories: QuizCategory[] = [
	{
		key: 'algebra',
		label: 'Algebra',
		title: 'Algebra Mastery',
		description: 'Persamaan, faktorisasi, dan transformasi aljabar dasar sampai menengah.',
		color: '#E91E63',
		questions: []
	},
	{
		key: 'geometry',
		label: 'Geometry',
		title: 'Geometry Explorer',
		description: 'Keliling, luas, sudut, dan Teorema Pythagoras dalam satu sesi.',
		color: '#00897B',
		questions: geometryQuestions
	},
	{
		key: 'statistics',
		label: 'Statistics',
		title: 'Statistics Lab',
		description: 'Mean, median, mode, dan range dengan contoh data yang mudah dibaca.',
		color: '#F57C00',
		questions: statisticsQuestions
	},
	{
		key: 'probability',
		label: 'Probability',
		title: 'Probability Challenge',
		description: 'Pelajari peluang dari koin, dadu, kartu, dan sampling sederhana.',
		color: '#7B1FA2',
		questions: probabilityQuestions
	}
];