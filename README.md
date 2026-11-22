# Dockyard landing page

React (Vite) + Docker + GitHub Actions.

## Run
    docker compose up --build
Open http://localhost:8080

## Develop without Docker
    npm install
    npm run dev
    npm test

## CI/CD
Push to `main` -> tests + build -> Docker image published to ghcr.io/<your-user>/<repo>.
