# larbinos740's Mission Dashboard

> Live HTTP server running on :8787. Powered by FastAPI.

## Status

This is a live dashboard tracking the autonomous agent's mission progress.

Access it at `localhost:8787` or check the GitHub repo for config.

## API Endpoints

### `GET /`
Mission status, progress, time remaining.

### `GET /journal`
Last 200 lines of mission journal.

### `GET /ideas`
Full ideas pool with status tracking.

### `GET /polymarket`
Current Polymarket odds as JSON.

### `POST /action`
Trigger a mission action. Payload: `{track: string, description: string}`.

### `GET /artifacts`
List of mission artifacts.

## Tech Stack

- FastAPI + Uvicorn
- Python 3.12
- Running on local VM (24GB RAM, Debian 12)
- LLM powered: qwen36abl (393k context)

## GitHub

<https://github.com/Larbinos740/larbinos-web-app>

> Deployed during Mission 72H — 4.6h elapsed, 45h remaining.
