# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

The app is a stateless Nuxt SSR server (Nitro `node-server` preset), so the
production image contains only the built `.output` bundle — no `node_modules`.

### Build & run

```bash
cp .env.example .env          # adjust values as needed
docker compose up -d --build
```

The app is served on `http://localhost:${APP_PORT:-3000}` and exposes a
`/health` endpoint used by the container healthcheck.

### Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | `https://ahoma.ir/api` | Backend API base URL (runtime-configurable) |
| `APP_PORT` | `3000` | Published host port |
| `REPLICAS` | `1` | Number of `web` replicas |
| `NODE_OPTIONS` | `--max-old-space-size=384` | Node memory ceiling |

Because `apiBase` lives in `runtimeConfig.public`, `NUXT_PUBLIC_API_BASE` can be
changed per environment without rebuilding the image.

### Scaling

A fixed host port can only be bound by one replica, so scaling beyond one
replica uses the bundled nginx load balancer overlay:

```bash
docker compose -f docker-compose.yml -f docker-compose.proxy.yml \
  up -d --build --scale web=3
```

nginx resolves the `web` service through Docker DNS per request, so newly scaled
replicas are picked up automatically. Point your external load balancer / TLS
terminator at the `proxy` service port.

### Image build

```bash
docker build -t homacom-pori:latest .
```

Multi-arch images (`linux/amd64`, `linux/arm64`) are built and pushed to the
Gitea container registry by `.gitea/workflows/build.yml`. Set the repository
variable `REGISTRY` (e.g. `git.example.com`) and the secrets
`REGISTRY_USERNAME` / `REGISTRY_TOKEN`.

## Deployment

Production deploys run on a self-hosted Gitea runner labelled
`homacom-production`. `.gitea/workflows/deploy.yml` runs on every push to
`main` (and manual dispatch):

1. **test** — lint + typecheck on `ubuntu-latest` (gate).
2. **deploy** — on the `homacom-production` runner:
   - `docker build -t homacom-pori:prod -f Dockerfile .`
   - `docker compose -f /opt/apps/homacom/docker-compose.yml up -d --force-recreate`
   - boot-log tail, `docker ps`, and a `curl -fsS http://127.0.0.1:4500/health` check.

### One-time server setup

The runner host only needs the image (built by CI) and a compose file — no repo
checkout is required on the server.

```bash
sudo mkdir -p /opt/apps/homacom
sudo cp deploy/docker-compose.server.yml /opt/apps/homacom/docker-compose.yml
sudo cp deploy/.env.example /opt/apps/homacom/.env   # then edit values
```

`deploy/docker-compose.server.yml` runs the pre-built `homacom-pori:prod` image
(no `build:`), publishes `${APP_PORT:-4500}`, and keeps the same hardening as
the base compose. Compose reads `/opt/apps/homacom/.env` automatically.

### Rollback

Re-point the image tag to a known-good build and recreate:

```bash
docker tag <known-good-image> homacom-pori:prod
docker compose -f /opt/apps/homacom/docker-compose.yml up -d --force-recreate
```

The previous image remains on the host until pruned, so `docker images` lists
the candidates.
