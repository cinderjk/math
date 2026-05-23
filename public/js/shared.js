export function jumpTo(selector) {
	document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

export function renderMath(node, expression, displayMode = false) {
	if (!node) return;
	if (window.katex) {
		try {
			window.katex.render(expression, node, { throwOnError: false, displayMode });
			return;
		} catch (error) {
			// fall through to text content
		}
	}
	node.textContent = expression;
}

export function observeRevealElements() {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	}, { threshold: 0.1 });

	document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

export function attachMobileMenuToggle(buttonId = 'mobileMenuButton', panelId = 'mobileMenuPanel') {
	const button = document.getElementById(buttonId);
	const panel = document.getElementById(panelId);
	if (!button || !panel) return;

	button.addEventListener('click', () => {
		panel.classList.toggle('hidden');
	});

	panel.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => panel.classList.add('hidden'));
	});
}

window.jumpTo = jumpTo;
window.renderMath = renderMath;
window.observeRevealElements = observeRevealElements;
window.attachMobileMenuToggle = attachMobileMenuToggle;
