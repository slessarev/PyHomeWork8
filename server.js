const path = require('path');
const os = require('os');
const express = require('express');

const app = express();
app.use(express.json());

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

let highScores = [];
const MAX_SCORES = 10;

function validateAndNormalizeScoreEntry(entry) {
	if (!entry || typeof entry !== 'object') return null;
	const nameRaw = typeof entry.name === 'string' ? entry.name : '';
	const scoreRaw = Number(entry.score);
	if (!Number.isFinite(scoreRaw) || scoreRaw < 0) return null;
	const name = nameRaw.trim().slice(0, 20) || 'Player';
	const score = Math.floor(scoreRaw);
	return { name, score, ts: Date.now() };
}

function addHighScore(entry) {
	highScores.push(entry);
	highScores.sort((a, b) => b.score - a.score || a.ts - b.ts);
	if (highScores.length > MAX_SCORES) {
		highScores = highScores.slice(0, MAX_SCORES);
	}
}

app.get('/api/ping', (req, res) => {
	res.json({ ok: true });
});

app.get('/api/scores', (req, res) => {
	res.json({ scores: highScores });
});

app.post('/api/scores', (req, res) => {
	const normalized = validateAndNormalizeScoreEntry(req.body);
	if (!normalized) {
		return res.status(400).json({ error: 'Invalid payload' });
	}
	addHighScore(normalized);
	res.json({ ok: true, scores: highScores });
});

app.get('*', (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'));
});

function getLocalAddresses() {
	const nets = os.networkInterfaces();
	const addrs = [];
	for (const name of Object.keys(nets)) {
		for (const net of nets[name] || []) {
			if (net.family === 'IPv4' && !net.internal) addrs.push(net.address);
		}
	}
	return addrs;
}

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
	const addrs = getLocalAddresses();
	console.log(`Server listening on http://${HOST}:${PORT}`);
	if (addrs.length) {
		console.log('LAN access:');
		for (const a of addrs) console.log(`  -> http://${a}:${PORT}`);
	}
});