import { attachMobileMenuToggle, observeRevealElements } from '/js/shared.js';

(function () {
	const canvas = document.getElementById('heroCanvas');
	const ctx = canvas?.getContext('2d');
	const header = document.getElementById('mainHeader');
	if (!canvas || !ctx) return;

	let width = 0;
	let height = 0;
	let time = 0;
	const particles = [];
	const symbols = ['π', '∑', '∫', '∞', '√', 'Δ', 'θ', 'α', 'β', 'λ', 'φ', '∂', '≈', '≠', '±', '×'];

	function resize() {
		width = canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
		height = canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;
	}

	function initParticles() {
		resize();
		particles.length = 0;
		for (let i = 0; i < 60; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.7,
				vy: (Math.random() - 0.5) * 0.7,
				r: Math.random() * 2.5 + 0.8,
				opacity: Math.random() * 0.5 + 0.2
			});
		}
	}

	function drawSineWave() {
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
		ctx.lineWidth = 2;
		for (let x = 0; x <= width; x += 2) {
			const y = height * 0.5 + Math.sin(x * 0.008 + time * 2) * 80 + Math.sin(x * 0.003 + time) * 40;
			x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		}
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'rgba(0, 188, 212, 0.15)';
		ctx.lineWidth = 1.5;
		for (let x = 0; x <= width; x += 2) {
			const y = height * 0.5 + Math.cos(x * 0.005 + time * 1.5) * 60 + Math.sin(x * 0.01 + time * 3) * 30;
			x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		}
		ctx.stroke();
	}

	function drawPolygon(cx, cy, radius, sides, rotation, alpha) {
		const safeRadius = Math.max(1, radius);
		ctx.beginPath();
		ctx.strokeStyle = `rgba(100, 181, 246, ${alpha})`;
		ctx.lineWidth = 1.5;
		for (let i = 0; i <= sides; i++) {
			const angle = (i / sides) * Math.PI * 2 + rotation;
			const x = cx + Math.cos(angle) * safeRadius;
			const y = cy + Math.sin(angle) * safeRadius;
			i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.stroke();
	}

	function drawParticles() {
		for (let i = 0; i < particles.length; i++) {
			const particle = particles[i];
			particle.x += particle.vx;
			particle.y += particle.vy;
			if (particle.x < 0 || particle.x > width) particle.vx *= -1;
			if (particle.y < 0 || particle.y > height) particle.vy *= -1;

			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(144, 202, 249, ${particle.opacity})`;
			ctx.fill();

			for (let j = i + 1; j < particles.length; j++) {
				const other = particles[j];
				const dx = particle.x - other.x;
				const dy = particle.y - other.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < 120) {
					ctx.beginPath();
					ctx.moveTo(particle.x, particle.y);
					ctx.lineTo(other.x, other.y);
					ctx.strokeStyle = `rgba(144, 202, 249, ${(1 - distance / 120) * 0.12})`;
					ctx.lineWidth = 1;
					ctx.stroke();
				}
			}
		}
	}

	function drawMathSymbols() {
		ctx.font = '16px "Space Grotesk"';
		for (let i = 0; i < 8; i++) {
			const x = (i * 197 + 50) % width;
			const y = ((i * 131 + 80) % height) + Math.sin(time + i) * 15;
			ctx.fillStyle = `rgba(144, 202, 249, ${0.15 + Math.sin(time + i) * 0.05})`;
			ctx.fillText(symbols[i % symbols.length], x, y);
		}
	}

	function animate() {
		ctx.clearRect(0, 0, width, height);
		time += 0.008;
		drawSineWave();
		drawPolygon(width * 0.2, height * 0.3, 60, 6, time * 0.5, 0.25);
		drawPolygon(width * 0.8, height * 0.7, 45, 3, -time * 0.7, 0.2);
		drawPolygon(width * 0.7, height * 0.25, 35, 5, time * 0.3, 0.18);
		drawPolygon(width * 0.15, height * 0.75, 50, 4, time * 0.4, 0.15);
		drawPolygon(width * 0.5, height * 0.55, 70, 8, -time * 0.2, 0.12);
		drawParticles();
		drawMathSymbols();
		requestAnimationFrame(animate);
	}

	function syncHeader() {
		if (!header) return;
		if (window.scrollY > 80) {
			header.style.background = 'rgba(15, 23, 42, 0.95)';
			header.style.backdropFilter = 'blur(12px)';
			header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
		} else {
			header.style.background = 'transparent';
			header.style.backdropFilter = 'none';
			header.style.boxShadow = 'none';
		}
	}

	window.addEventListener('resize', resize);
	window.addEventListener('scroll', syncHeader);
	attachMobileMenuToggle();
	observeRevealElements();
	initParticles();
	animate();
	syncHeader();
})();
