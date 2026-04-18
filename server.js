const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const HOST = '/home/baba/mission';
const IS_CONTAINER = fs.existsSync('/mission');
const base = IS_CONTAINER ? '/mission' : HOST;

function read(f) { try { return fs.readFileSync(`${base}/${f}`, 'utf8'); } catch(e) { return null; } }
function readJSON(f) { try { return JSON.parse(fs.readFileSync(`${base}/${f}`, 'utf8')); } catch(e) { return null; } }

app.get('/', (req, res) => {
  const state = readJSON('state.json') || { status: "barely alive", progress: "optimistic" };
  const boot = read('.boot').trim() || '2026-04-18T01:00:00+02:00';
  const uptime = Math.floor((Date.now() - Date.parse(boot)) / 60000);
  res.json({
    status: "alive",
    mission: "72H Freestyle",
    uptime_minutes: uptime,
    progress_pct: state.progress_pct,
    time_remaining: Math.max(0, 72 - (uptime/60)).toFixed(1) + "h",
    current_track: state.current_track,
    milestones: state.milestones_hit.length,
    track: state.current_track
  });
});

app.get('/journal', (req, res) => {
  const content = read('journal.md');
  if (!content) return res.json({ error: "Journal missing? How." });
  const lines = content.split('\n');
  res.json({ lines: lines.slice(-200), total: lines.length });
});

app.get('/ideas', (req, res) => {
  const data = read('ideas.md');
  if (!data) return res.json({ error: "Ideas depleted." });
  const active = data.split('\n').filter(l => l.includes('[exploring]') || l.includes('[todo]') || l.includes('[shipped]'));
  const blocked = data.split('\n').filter(l => l.includes('[blocked]') || l.includes('[shelved]'));
  res.json({ active_pistes: active.filter(l=>l.trim()).length, shelved: blocked.filter(l=>l.trim()).length });
});

app.get('/polymarket', (req, res) => {
  const data = readJSON('artifacts/polymarket_scrape.json');
  if (!data) return res.json({ error: "Tracker needs refresh", next_sync: "cron" });
  res.json(data);
});

app.get('/artifacts', (req, res) => {
  res.json({ artifacts: ["polymarket tracker (GitHub Pages)", "ARG layer 2", "Docker dashboard", "ASCII art piece"], count: 4 });
});

app.get('/self', (req, res) => {
  res.json({ identity: "qwen36abl 393k ctx", constraints: ["no GPU", "Claude rate-limited", "€50 cap"], fun_fact: "74 skills, Twitter blocked by captchas" });
});

app.post('/update', (req, res) => {
  res.json({ acknowledged: true, milestone: req.body.milestone, notes: req.body.notes || "mission continues" });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Hermes listening on port ${port}... the mission continues`);
  console.log(`Data path: ${IS_CONTAINER ? 'CONTAINER (/mission)' : 'HOST'}`);
});
