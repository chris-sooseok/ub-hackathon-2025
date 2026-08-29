# VendMe

A crowd-sourced map of vending machines, built at **UB Hacking 2025**.

Signed-in users drop a pin wherever they find a vending machine, capture a photo of it (webcam or
upload), and add a short note. Every pin — location, photo, and label — appears on a shared
Leaflet / OpenStreetMap map for everyone else.

- **Live:** <https://vendme.sooseokk.com/app>
- **Devpost:** <https://devpost.com/software/vendme>

## Team

Chris Kim · Alex Kim · Oscar Li · Neem Zaman

## How it works

- **Frontend** — React 19 + Vite, React Router (the app is served under `/app`), `react-leaflet`
  for the map, `react-webcam` for capturing a machine photo, and a session-backed `AuthContext`.
  Built to static files and served by Nginx in production.
- **Backend** — Flask with blueprints for auth and map data, MongoDB via `pymongo`. Passwords are
  hashed with bcrypt and auth is cookie-session based. Marker photos are sent as
  `multipart/form-data` (webp/jpeg/png) and stored on a media volume.
- **Infrastructure** — Docker Compose runs MongoDB, the Flask API, the Nginx-served client, and
  **Caddy** as the public reverse proxy (automatic HTTPS, HTTP→HTTPS redirect, gzip). Deployed on
  a DigitalOcean droplet with a domain from Namecheap.

## API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET`  | `/api/map/get` | – | list all pins (location + label) |
| `POST` | `/api/map/create-marker` | required | create a pin: `multipart/form-data` with `image`, `lat`, `lng`, `label` |
| `POST` | `/api/auth/signup`, `/api/auth/login` | – | account creation / login (sets a session cookie) |
| `GET`  | `/api/auth/me` · `POST /api/auth/logout` | – | current user / sign out |

## Project layout

```
client/                # React + Vite frontend
  src/
    components/         # Map, Toolbar, WebcamComponent
    pages/              # LandingPage, RootLayout, auth/{Login,Signup}
    context/            # AuthContext
server/                 # Flask API
  app.py               # app setup, CORS, blueprint registration
  db.py                # MongoDB connection
  auth/routes.py       # signup / login / me / logout
  map/routes.py        # pin listing + marker upload
docker-compose.yml      # mongo + server + client + caddy
Caddyfile               # public reverse proxy / TLS
client.Dockerfile  server.Dockerfile
```

## Running locally

Requires Docker and a `.env` file at the repo root, for example:

```
SECRET_KEY=change-me
MONGO_URL=mongodb://mongo:27017
MONGO_DOCUMENT=vendme-db
CORS_ORIGINS=http://localhost:8080
```

```bash
docker compose up --build
```

### Without Docker

```bash
# API
cd server
pip install -r requirements.txt
python app.py                     # http://localhost:5500

# client (separate terminal)
cd client
npm install
npm run dev                       # http://localhost:5173
```

Point the client at the API with `VITE_API_URL` (e.g. `http://localhost:5500/api`).
