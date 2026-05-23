import { renderMath } from '/js/shared.js';

const plotterState = {
	type: 'sine',
	showDerivative: false,
	params: { a: 1, b: 1, c: 0, d: 0, h: 0, k: 0 },
	mouseX: null,
	mouseY: null
};

const funcConfigs = {
	quadratic: {
		params: [
			{ key: 'a', label: 'a (coefficient)', min: -5, max: 5, step: 0.1, default: 1 },
			{ key: 'b', label: 'b (coefficient)', min: -5, max: 5, step: 0.1, default: 0 },
			{ key: 'c', label: 'c (constant)', min: -10, max: 10, step: 0.1, default: 0 }
		],
		fn: (x, params) => params.a * x * x + params.b * x + params.c,
		derivative: (x, params) => 2 * params.a * x + params.b,
		formulaDisplay: (params) => `f(x) = ${params.a}x^2 + ${params.b}x + ${params.c}`
	},
	sine: {
		params: [
			{ key: 'a', label: 'a (amplitude)', min: -5, max: 5, step: 0.1, default: 1 },
			{ key: 'b', label: 'b (frequency)', min: 0.1, max: 10, step: 0.1, default: 1 },
			{ key: 'c', label: 'c (phase shift)', min: -6.28, max: 6.28, step: 0.1, default: 0 },
			{ key: 'd', label: 'd (vertical shift)', min: -5, max: 5, step: 0.1, default: 0 }
		],
		fn: (x, params) => params.a * Math.sin(params.b * x + params.c) + params.d,
		derivative: (x, params) => params.a * params.b * Math.cos(params.b * x + params.c),
		formulaDisplay: (params) => `f(x) = ${params.a}\\sin(${params.b}x ${params.c >= 0 ? '+' : '-'} ${Math.abs(params.c)}) ${params.d >= 0 ? '+' : '-'} ${Math.abs(params.d)}`
	},
	exponential: {
		params: [
			{ key: 'a', label: 'a (coefficient)', min: -5, max: 5, step: 0.1, default: 1 },
			{ key: 'b', label: 'b (base)', min: 0.1, max: 5, step: 0.1, default: 2 },
			{ key: 'c', label: 'c (shift)', min: -5, max: 5, step: 0.1, default: 0 }
		],
		fn: (x, params) => params.a * Math.pow(Math.max(0.001, params.b), x) + params.c,
		derivative: (x, params) => params.a * Math.pow(Math.max(0.001, params.b), x) * Math.log(Math.max(0.001, params.b)),
		formulaDisplay: (params) => `f(x) = ${params.a} \\cdot ${params.b}^{x} ${params.c >= 0 ? '+' : '-'} ${Math.abs(params.c)}`
	},
	absolute: {
		params: [
			{ key: 'a', label: 'a (slope)', min: -5, max: 5, step: 0.1, default: 1 },
			{ key: 'h', label: 'h (x-shift)', min: -5, max: 5, step: 0.1, default: 0 },
			{ key: 'k', label: 'k (y-shift)', min: -5, max: 5, step: 0.1, default: 0 }
		],
		fn: (x, params) => params.a * Math.abs(x - params.h) + params.k,
		derivative: (x, params) => (x > params.h ? params.a : -params.a),
		formulaDisplay: (params) => `f(x) = ${params.a}|x ${params.h >= 0 ? '-' : '+'} ${Math.abs(params.h)}| ${params.k >= 0 ? '+' : '-'} ${Math.abs(params.k)}`
	}
};

function buildSliders() {
	const container = document.getElementById('slidersContainer');
	if (!container) return;

	const config = funcConfigs[plotterState.type];
	container.innerHTML = '';

	config.params.forEach((param) => {
		const value = plotterState.params[param.key] !== undefined ? plotterState.params[param.key] : param.default;
		plotterState.params[param.key] = value;

		const wrapper = document.createElement('div');
		wrapper.className = 'space-y-2';
		wrapper.innerHTML = `
			<div class="flex items-center justify-between gap-4">
				<label for="slider_${param.key}" class="text-sm font-medium text-slate-700">${param.label}</label>
				<span id="val_${param.key}" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">${value}</span>
			</div>
			<input type="range" id="slider_${param.key}" min="${param.min}" max="${param.max}" step="${param.step}" value="${value}">
		`;

		const slider = wrapper.querySelector('input');
		if (slider) {
			slider.addEventListener('input', function () {
				plotterState.params[param.key] = parseFloat(this.value);
				const val = document.getElementById(`val_${param.key}`);
				if (val) val.textContent = this.value;
				updatePlotter();
			});
		}

		container.appendChild(wrapper);
	});
}

function drawPlotter() {
	const canvas = document.getElementById('plotterCanvas');
	if (!canvas) return;
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const width = rect.width;
	const height = rect.height;
	const config = funcConfigs[plotterState.type];
	const xMin = -10;
	const xMax = 10;
	const yMin = -6;
	const yMax = 6;
	const toScreenX = (x) => ((x - xMin) / (xMax - xMin)) * width;
	const toScreenY = (y) => ((yMax - y) / (yMax - yMin)) * height;
	const toMathX = (screenX) => xMin + (screenX / width) * (xMax - xMin);

	ctx.fillStyle = '#fafbfe';
	ctx.fillRect(0, 0, width, height);

	ctx.strokeStyle = '#e8ecf2';
	ctx.lineWidth = 0.5;
	for (let x = Math.ceil(xMin); x <= xMax; x++) {
		ctx.beginPath();
		ctx.moveTo(toScreenX(x), 0);
		ctx.lineTo(toScreenX(x), height);
		ctx.stroke();
	}
	for (let y = Math.ceil(yMin); y <= yMax; y++) {
		ctx.beginPath();
		ctx.moveTo(0, toScreenY(y));
		ctx.lineTo(width, toScreenY(y));
		ctx.stroke();
	}

	ctx.strokeStyle = '#94a3b8';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(0, toScreenY(0));
	ctx.lineTo(width, toScreenY(0));
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(toScreenX(0), 0);
	ctx.lineTo(toScreenX(0), height);
	ctx.stroke();

	ctx.fillStyle = '#94a3b8';
	ctx.font = '11px "JetBrains Mono"';
	ctx.textAlign = 'center';
	for (let x = Math.ceil(xMin); x <= xMax; x++) {
		if (x === 0) continue;
		ctx.fillText(String(x), toScreenX(x), toScreenY(0) + 15);
	}
	ctx.textAlign = 'right';
	for (let y = Math.ceil(yMin); y <= yMax; y++) {
		if (y === 0) continue;
		ctx.fillText(String(y), toScreenX(0) - 8, toScreenY(y) + 4);
	}

	ctx.beginPath();
	ctx.strokeStyle = '#1565c0';
	ctx.lineWidth = 3;
	ctx.lineJoin = 'round';
	let drawing = false;
	for (let screenX = 0; screenX <= width; screenX += 1) {
		const x = toMathX(screenX);
		const y = config.fn(x, plotterState.params);
		const screenY = toScreenY(y);
		if (screenY < -100 || screenY > height + 100) {
			drawing = false;
			continue;
		}
		if (!drawing) {
			ctx.moveTo(screenX, screenY);
			drawing = true;
		} else {
			ctx.lineTo(screenX, screenY);
		}
	}
	ctx.stroke();

	if (plotterState.showDerivative) {
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(233, 30, 99, 0.6)';
		ctx.lineWidth = 2;
		ctx.setLineDash([6, 4]);
		drawing = false;
		for (let screenX = 0; screenX <= width; screenX += 1) {
			const x = toMathX(screenX);
			const y = config.derivative(x, plotterState.params);
			const screenY = toScreenY(y);
			if (screenY < -100 || screenY > height + 100) {
				drawing = false;
				continue;
			}
			if (!drawing) {
				ctx.moveTo(screenX, screenY);
				drawing = true;
			} else {
				ctx.lineTo(screenX, screenY);
			}
		}
		ctx.stroke();
		ctx.setLineDash([]);
	}

	if (plotterState.mouseX !== null) {
		const mouseX = plotterState.mouseX;
		const mathX = toMathX(mouseX);
		const mathY = config.fn(mathX, plotterState.params);
		const screenY = toScreenY(mathY);

		ctx.strokeStyle = 'rgba(21, 101, 192, 0.2)';
		ctx.lineWidth = 1;
		ctx.setLineDash([4, 4]);
		ctx.beginPath();
		ctx.moveTo(mouseX, 0);
		ctx.lineTo(mouseX, height);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, screenY);
		ctx.lineTo(width, screenY);
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.beginPath();
		ctx.arc(mouseX, screenY, 6, 0, Math.PI * 2);
		ctx.fillStyle = '#1565c0';
		ctx.fill();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.stroke();

		const coordDisplay = document.getElementById('coordDisplay');
		if (coordDisplay) {
			coordDisplay.textContent = `x = ${mathX.toFixed(2)}, f(x) = ${mathY.toFixed(2)}`;
		}
	}
}

function updatePlotter() {
	plotterState.type = document.getElementById('funcType')?.value ?? plotterState.type;
	const config = funcConfigs[plotterState.type];
	renderMath(document.getElementById('formulaDisplay'), config.formulaDisplay(plotterState.params), true);
	drawPlotter();
}

function resetPlotter() {
	const config = funcConfigs[plotterState.type];
	config.params.forEach((param) => {
		plotterState.params[param.key] = param.default;
		const slider = document.getElementById(`slider_${param.key}`);
		const value = document.getElementById(`val_${param.key}`);
		if (slider) slider.value = String(param.default);
		if (value) value.textContent = String(param.default);
	});
	updatePlotter();
}

function toggleDerivative() {
	plotterState.showDerivative = !plotterState.showDerivative;
	const button = document.getElementById('derivBtn');
	if (button) {
		button.innerHTML = plotterState.showDerivative
			? '<i class="fas fa-wave-square mr-2"></i>Hide Derivative'
			: '<i class="fas fa-wave-square mr-2"></i>Show Derivative';
		button.classList.toggle('bg-sky-600', plotterState.showDerivative);
		button.classList.toggle('bg-slate-900', !plotterState.showDerivative);
	}
	drawPlotter();
}

function bindPlotter() {
	const funcType = document.getElementById('funcType');
	const canvas = document.getElementById('plotterCanvas');
	if (!funcType || !canvas) return;

	buildSliders();
	updatePlotter();

	funcType.addEventListener('change', function () {
		plotterState.type = this.value;
		plotterState.params = { a: 1, b: 1, c: 0, d: 0, h: 0, k: 0 };
		plotterState.showDerivative = false;
		const derivBtn = document.getElementById('derivBtn');
		if (derivBtn) {
			derivBtn.innerHTML = '<i class="fas fa-wave-square mr-2"></i>Show Derivative';
			derivBtn.classList.remove('bg-sky-600');
			derivBtn.classList.add('bg-slate-900');
		}
		buildSliders();
		updatePlotter();
	});

	canvas.addEventListener('mousemove', function (event) {
		const rect = this.getBoundingClientRect();
		plotterState.mouseX = event.clientX - rect.left;
		plotterState.mouseY = event.clientY - rect.top;
		drawPlotter();
	});

	canvas.addEventListener('mouseleave', function () {
		plotterState.mouseX = null;
		plotterState.mouseY = null;
		const coordDisplay = document.getElementById('coordDisplay');
		if (coordDisplay) coordDisplay.textContent = 'Hover to see coordinates';
		drawPlotter();
	});

	window.addEventListener('resize', () => drawPlotter());
}

window.toggleDerivative = toggleDerivative;
window.resetPlotter = resetPlotter;

bindPlotter();
