import { renderMath } from '/js/shared.js';

(function () {
	const canvas = document.getElementById('geoCanvas');
	const ctx = canvas?.getContext('2d');
	if (!canvas || !ctx) return;

	const dpr = window.devicePixelRatio || 1;
	let width = 0;
	let height = 0;
	let dragging = null;
	const vertexRadius = 12;
	let vertices = [
		{ label: 'A', x: 0.3, y: 0.25, color: '#E91E63' },
		{ label: 'B', x: 0.7, y: 0.25, color: '#00897B' },
		{ label: 'C', x: 0.45, y: 0.75, color: '#1565C0' }
	];

	function resize() {
		const rect = canvas.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		draw();
	}

	function toPixel(vertex) {
		return { x: vertex.x * width, y: vertex.y * height };
	}

	function toNorm(pixelX, pixelY) {
		return { x: pixelX / width, y: pixelY / height };
	}

	function dist(a, b) {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
	}

	function angleBetween(a, b, c) {
		const ba = { x: a.x - b.x, y: a.y - b.y };
		const bc = { x: c.x - b.x, y: c.y - b.y };
		const dot = ba.x * bc.x + ba.y * bc.y;
		const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2);
		const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2);
		if (magBA === 0 || magBC === 0) return 0;
		return Math.acos(Math.max(-1, Math.min(1, dot / (magBA * magBC)))) * 180 / Math.PI;
	}

	function triangleArea(a, b, c) {
		return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
	}

	function classifyTriangle(angA, angB, angC) {
		const sides = [dist(vertices[0], vertices[1]), dist(vertices[1], vertices[2]), dist(vertices[0], vertices[2])].sort((a, b) => a - b);
		let byAngle = 'Acute';
		if (angA > 89.5 || angB > 89.5 || angC > 89.5) byAngle = 'Right';
		if (angA > 90.5 || angB > 90.5 || angC > 90.5) byAngle = 'Obtuse';
		let bySides = 'Scalene';
		const epsilon = 0.02;
		if (Math.abs(sides[0] - sides[1]) < epsilon && Math.abs(sides[1] - sides[2]) < epsilon) bySides = 'Equilateral';
		else if (Math.abs(sides[0] - sides[1]) < epsilon || Math.abs(sides[1] - sides[2]) < epsilon) bySides = 'Isosceles';
		return `${byAngle}, ${bySides}`;
	}

	function draw() {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#fafbfe';
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = '#eef1f6';
		ctx.lineWidth = 0.5;
		const gridSize = 30;
		for (let x = 0; x < width; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
		for (let y = 0; y < height; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}

		const points = vertices.map(toPixel);

		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		ctx.lineTo(points[1].x, points[1].y);
		ctx.lineTo(points[2].x, points[2].y);
		ctx.closePath();
		ctx.fillStyle = 'rgba(21, 101, 192, 0.06)';
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		ctx.lineTo(points[1].x, points[1].y);
		ctx.lineTo(points[2].x, points[2].y);
		ctx.closePath();
		ctx.strokeStyle = '#1565c0';
		ctx.lineWidth = 2.5;
		ctx.stroke();

		for (let i = 0; i < 3; i++) {
			const next = (i + 1) % 3;
			const midpointX = (points[i].x + points[next].x) / 2;
			const midpointY = (points[i].y + points[next].y) / 2;
			const sideLength = dist(vertices[i], vertices[next]) * 20;
			const centerX = (points[0].x + points[1].x + points[2].x) / 3;
			const centerY = (points[0].y + points[1].y + points[2].y) / 3;
			const offsetX = midpointX - centerX;
			const offsetY = midpointY - centerY;
			const magnitude = Math.sqrt(offsetX * offsetX + offsetY * offsetY) || 1;
			const labelX = midpointX + (offsetX / magnitude) * 18;
			const labelY = midpointY + (offsetY / magnitude) * 18;

			ctx.fillStyle = '#64748b';
			ctx.font = '12px "JetBrains Mono"';
			ctx.textAlign = 'center';
			ctx.fillText(sideLength.toFixed(1), labelX, labelY + 4);
		}

		for (let i = 0; i < 3; i++) {
			const prev = (i + 2) % 3;
			const next = (i + 1) % 3;
			const point = points[i];
			const angleStart = Math.atan2(points[prev].y - point.y, points[prev].x - point.x);
			const angleEnd = Math.atan2(points[next].y - point.y, points[next].x - point.x);
			ctx.beginPath();
			ctx.arc(point.x, point.y, 20, angleStart, angleEnd, false);
			ctx.strokeStyle = `${vertices[i].color}60`;
			ctx.lineWidth = 2;
			ctx.stroke();
		}

		for (let i = 0; i < 3; i++) {
			const point = points[i];
			ctx.beginPath();
			ctx.arc(point.x, point.y, vertexRadius + 4, 0, Math.PI * 2);
			ctx.fillStyle = `${vertices[i].color}20`;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(point.x, point.y, vertexRadius, 0, Math.PI * 2);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.strokeStyle = vertices[i].color;
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.fillStyle = vertices[i].color;
			ctx.font = 'bold 14px "Space Grotesk"';
			ctx.textAlign = 'center';
			ctx.fillText(vertices[i].label, point.x, point.y - vertexRadius - 8);
		}

		updateMeasure();
	}

	function updateMeasure() {
		const [a, b, c] = vertices;
		const sideAB = dist(a, b) * 20;
		const sideBC = dist(b, c) * 20;
		const sideAC = dist(a, c) * 20;
		const angleA = angleBetween(b, a, c);
		const angleB = angleBetween(a, b, c);
		const angleC = angleBetween(a, c, b);
		const rawArea = triangleArea(
			{x: a.x * width, y: a.y * height},
			{x: b.x * width, y: b.y * height},
			{x: c.x * width, y: c.y * height}
		);
		const perimeter = sideAB + sideBC + sideAC;

		const sideABEl = document.getElementById('sideAB');
		const sideBCEl = document.getElementById('sideBC');
		const sideACEl = document.getElementById('sideAC');
		const angleAEl = document.getElementById('angleA');
		const angleBEl = document.getElementById('angleB');
		const angleCEl = document.getElementById('angleC');
		const perimeterEl = document.getElementById('perimeter');
		const areaEl = document.getElementById('area');
		const triTypeEl = document.getElementById('triType');

		if (sideABEl) sideABEl.textContent = sideAB.toFixed(2);
		if (sideBCEl) sideBCEl.textContent = sideBC.toFixed(2);
		if (sideACEl) sideACEl.textContent = sideAC.toFixed(2);
		if (angleAEl) angleAEl.textContent = `${angleA.toFixed(1)}°`;
		if (angleBEl) angleBEl.textContent = `${angleB.toFixed(1)}°`;
		if (angleCEl) angleCEl.textContent = `${angleC.toFixed(1)}°`;
		if (perimeterEl) perimeterEl.textContent = perimeter.toFixed(2);
		if (areaEl) areaEl.textContent = `${rawArea.toFixed(0)} px²`;
		if (triTypeEl) triTypeEl.textContent = classifyTriangle(angleA, angleB, angleC);

		renderMath(document.getElementById('areaFormula'), 'A = \\frac{1}{2}bh', true);
	}

	function getPos(event) {
		const rect = canvas.getBoundingClientRect();
		const touch = event.touches ? event.touches[0] : event;
		return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
	}

	function onDown(event) {
		event.preventDefault();
		const pos = getPos(event);
		const points = vertices.map(toPixel);
		for (let i = 0; i < 3; i++) {
			if (dist(pos, points[i]) < vertexRadius + 8) {
				dragging = i;
				canvas.style.cursor = 'grabbing';
				break;
			}
		}
	}

	function onMove(event) {
		if (dragging === null) return;
		event.preventDefault();
		const pos = getPos(event);
		const norm = toNorm(pos.x, pos.y);
		vertices[dragging].x = Math.max(0.05, Math.min(0.95, norm.x));
		vertices[dragging].y = Math.max(0.05, Math.min(0.95, norm.y));
		draw();
	}

	function onUp() {
		dragging = null;
		canvas.style.cursor = 'grab';
	}

	canvas.addEventListener('mousedown', onDown);
	canvas.addEventListener('mousemove', onMove);
	canvas.addEventListener('mouseup', onUp);
	canvas.addEventListener('mouseleave', onUp);
	canvas.addEventListener('touchstart', onDown, { passive: false });
	canvas.addEventListener('touchmove', onMove, { passive: false });
	canvas.addEventListener('touchend', onUp);

	window.addEventListener('resize', resize);
	resize();
})();
