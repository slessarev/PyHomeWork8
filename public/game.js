(() => {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	const scoreEl = document.getElementById('scoreValue');
	const restartBtn = document.getElementById('restartBtn');
	const controlsEl = document.getElementById('controls');
	const scoresListEl = document.getElementById('scoresList');

	let tileSize = 20;
	let boardCols = 20;
	let boardRows = 24;
	let tickIntervalMs = 120;
	let tickTimer = null;

	const Direction = {
		Up: 'up',
		Down: 'down',
		Left: 'left',
		Right: 'right'
	};

	let currentDirection = Direction.Right;
	let nextDirection = Direction.Right;
	let snake = [];
	let food = null;
	let score = 0;
	let isGameOver = false;

	function resizeCanvas() {
		const ctrlH = controlsEl.offsetHeight || 150;
		const availableW = window.innerWidth - 16;
		const availableH = window.innerHeight - ctrlH - 130; // topbar + margins
		const targetTiles = 24;
		tileSize = Math.max(12, Math.floor(Math.min(availableW, availableH) / targetTiles));
		boardCols = Math.max(12, Math.floor(availableW / tileSize));
		boardRows = Math.max(16, Math.floor((window.innerHeight - ctrlH - 80) / tileSize));
		canvas.width = boardCols * tileSize;
		canvas.height = boardRows * tileSize;
		draw();
	}

	function setDirection(dir) {
		if (dir === currentDirection) return;
		if (dir === Direction.Left && currentDirection === Direction.Right) return;
		if (dir === Direction.Right && currentDirection === Direction.Left) return;
		if (dir === Direction.Up && currentDirection === Direction.Down) return;
		if (dir === Direction.Down && currentDirection === Direction.Up) return;
		nextDirection = dir;
	}

	function initGame() {
		isGameOver = false;
		score = 0;
		scoreEl.textContent = String(score);
		currentDirection = Direction.Right;
		nextDirection = Direction.Right;
		const startX = Math.floor(boardCols / 3);
		const startY = Math.floor(boardRows / 2);
		snake = [
			{ x: startX, y: startY },
			{ x: startX - 1, y: startY },
			{ x: startX - 2, y: startY }
		];
		food = spawnFood();
		if (tickTimer) clearInterval(tickTimer);
		tickTimer = setInterval(tick, tickIntervalMs);
		draw();
	}

	function spawnFood() {
		const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
		let x, y;
		let guard = 0;
		while (guard < 1000) {
			x = Math.floor(Math.random() * boardCols);
			y = Math.floor(Math.random() * boardRows);
			if (!occupied.has(`${x},${y}`)) return { x, y };
			guard += 1;
		}
		return { x: 1, y: 1 };
	}

	function tick() {
		if (isGameOver) return;
		currentDirection = nextDirection;
		const head = snake[0];
		let next = { x: head.x, y: head.y };
		switch (currentDirection) {
			case Direction.Left: next.x -= 1; break;
			case Direction.Right: next.x += 1; break;
			case Direction.Up: next.y -= 1; break;
			case Direction.Down: next.y += 1; break;
		}
		if (next.x < 0 || next.x >= boardCols || next.y < 0 || next.y >= boardRows) {
			return gameOver();
		}
		for (let i = 0; i < snake.length; i++) {
			if (snake[i].x === next.x && snake[i].y === next.y) return gameOver();
		}
		snake.unshift(next);
		if (next.x === food.x && next.y === food.y) {
			score += 1;
			scoreEl.textContent = String(score);
			food = spawnFood();
			if (score % 5 === 0 && tickIntervalMs > 70) {
				// Slight speed-up
				clearInterval(tickTimer);
				tickIntervalMs -= 5;
				tickTimer = setInterval(tick, tickIntervalMs);
			}
		} else {
			snake.pop();
		}
		draw();
	}

	function draw() {
		ctx.fillStyle = '#0d1422';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = 'rgba(255,255,255,0.05)';
		ctx.lineWidth = 1;
		for (let x = 0; x <= boardCols; x++) {
			ctx.beginPath();
			ctx.moveTo(x * tileSize + 0.5, 0);
			ctx.lineTo(x * tileSize + 0.5, canvas.height);
			ctx.stroke();
		}
		for (let y = 0; y <= boardRows; y++) {
			ctx.beginPath();
			ctx.moveTo(0, y * tileSize + 0.5);
			ctx.lineTo(canvas.width, y * tileSize + 0.5);
			ctx.stroke();
		}

		const headColor = '#38ef7d';
		const bodyColor = '#34d87b';
		ctx.fillStyle = bodyColor;
		for (let i = snake.length - 1; i >= 0; i--) {
			const p = snake[i];
			ctx.fillStyle = i === 0 ? headColor : bodyColor;
			ctx.fillRect(p.x * tileSize + 2, p.y * tileSize + 2, tileSize - 4, tileSize - 4);
		}

		ctx.fillStyle = '#ff7b54';
		ctx.fillRect(food.x * tileSize + 3, food.y * tileSize + 3, tileSize - 6, tileSize - 6);

		if (isGameOver) {
			ctx.fillStyle = 'rgba(0,0,0,0.5)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#e8eef9';
			ctx.textAlign = 'center';
			ctx.font = `${Math.max(18, Math.floor(tileSize * 1.2))}px system-ui`;
			ctx.fillText('Игра окончена', canvas.width / 2, canvas.height / 2 - tileSize);
			ctx.font = `${Math.max(14, Math.floor(tileSize * 0.9))}px system-ui`;
			ctx.fillText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2 + tileSize * 0.2);
			ctx.font = `${Math.max(12, Math.floor(tileSize * 0.8))}px system-ui`;
			ctx.fillText('Нажмите ⟲, чтобы начать заново', canvas.width / 2, canvas.height / 2 + tileSize * 1.6);
		}
	}

	function gameOver() {
		isGameOver = true;
		clearInterval(tickTimer);
		submitScore(score).finally(() => fetchScores());
		draw();
	}

	function handleKey(e) {
		switch (e.key) {
			case 'ArrowUp': case 'w': case 'W': setDirection(Direction.Up); break;
			case 'ArrowDown': case 's': case 'S': setDirection(Direction.Down); break;
			case 'ArrowLeft': case 'a': case 'A': setDirection(Direction.Left); break;
			case 'ArrowRight': case 'd': case 'D': setDirection(Direction.Right); break;
		}
	}

	function bindControls() {
		document.addEventListener('keydown', handleKey, { passive: true });
		controlsEl.addEventListener('touchstart', (e) => {
			const target = e.target.closest('button[data-dir]');
			if (!target) return;
			e.preventDefault();
			setDirection(target.getAttribute('data-dir'));
		}, { passive: false });
		controlsEl.addEventListener('click', (e) => {
			const target = e.target.closest('button[data-dir]');
			if (!target) return;
			setDirection(target.getAttribute('data-dir'));
		});
		restartBtn.addEventListener('click', () => {
			if (tickTimer) clearInterval(tickTimer);
			resizeCanvas();
			initGame();
		});
	}

	async function fetchScores() {
		try {
			const res = await fetch('/api/scores');
			if (!res.ok) return;
			const data = await res.json();
			renderScores(data.scores || []);
		} catch {}
	}

	function renderScores(scores) {
		scoresListEl.innerHTML = '';
		scores.forEach((s) => {
			const li = document.createElement('li');
			li.textContent = `${s.name} — ${s.score}`;
			scoresListEl.appendChild(li);
		});
	}

	async function submitScore(scoreVal) {
		try {
			let name = localStorage.getItem('playerName') || '';
			if (!name) {
				name = prompt('Ваше имя для таблицы рекордов?', 'Player') || 'Player';
				localStorage.setItem('playerName', name);
			}
			await fetch('/api/scores', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, score: scoreVal })
			});
		} catch {}
	}

	window.addEventListener('resize', () => {
		const prevCols = boardCols;
		const prevRows = boardRows;
		resizeCanvas();
		if (prevCols !== boardCols || prevRows !== boardRows) {
			// Restart on drastic resize to keep logic simple
			if (!isGameOver) initGame();
		}
	});

	bindControls();
	resizeCanvas();
	initGame();
	fetchScores();
})();