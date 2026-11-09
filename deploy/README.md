# Production deployment

## Requirements

- Ubuntu 24.04 VPS with Docker Engine and Docker Compose plugin.
- GitHub repository with Actions enabled.
- A domain pointing to the VPS. The current Nginx configuration serves HTTP on port 80; configure TLS after the domain is confirmed.
- Yandex Object Storage bucket and static access key if image uploads are required.

## GitHub configuration

Add these repository Actions secrets:

- `VPS_HOST` — VPS public IP or hostname.
- `VPS_PORT` — SSH port, normally `22`.
- `VPS_USER` — `deploy`.
- `VPS_SSH_KEY` — private SSH key matching the public key installed for `deploy`.
- `GHCR_USERNAME` — GitHub username with package read access.
- `GHCR_PULL_TOKEN` — GitHub token with `read:packages`.

The workflow builds and pushes three images to GHCR, copies the Compose/Nginx files to `/opt/drum-dealer`, applies Prisma migrations, and restarts the services. The server must be able to pull the packages.

## Server preparation

Before the first workflow run, copy the environment template from your local project directory to the VPS:

```bash
scp deploy/env.production.example deploy@YOUR_VPS_HOST:/opt/drum-dealer/.env.production.example
ssh deploy@YOUR_VPS_HOST
```

Then run on the VPS as `deploy`:

```bash
cd /opt/drum-dealer
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Set `GHCR_OWNER` to the lowercase GitHub owner. Generate secrets on the server:

```bash
openssl rand -hex 32
openssl rand -hex 48
```

Use one value for `POSTGRES_PASSWORD` and the other for `JWT_SECRET`. Keep the database password URL-safe (hex output is suitable). Fill in the real Yandex Object Storage values without sending them to anyone. Set `FRONTEND_URL` to the site's origin.

Do not publish PostgreSQL, backend, or frontend ports. The production Compose file exposes only Nginx on port 80.

## First deployment

Push the deployment files and workflow to the `master` branch. Add the GitHub secrets above. The first successful workflow run will pull images, apply migrations, and start the services.

Check status and logs:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs -f --tail=100
```

Health endpoint: `http://YOUR_DOMAIN/api/health`.

## Create the first administrator

Do not run the demo seed in production: it creates a predictable `admin@example.com / admin123` account and demo data. Create a unique administrator instead:

```bash
read -r -p 'Admin email: ' ADMIN_EMAIL
read -r -s -p 'Admin password (12+ chars): ' ADMIN_PASSWORD; echo
export ADMIN_EMAIL ADMIN_PASSWORD
docker compose --env-file .env.production -f docker-compose.production.yml exec -T -e ADMIN_EMAIL -e ADMIN_PASSWORD backend node /app/deploy/create-admin.js
unset ADMIN_EMAIL ADMIN_PASSWORD
```

## Backups

The PostgreSQL data is stored in the named Docker volume `postgres_data`. Before production use, configure automated off-server PostgreSQL backups and periodically test restoration. Do not treat the Docker volume as a backup.

## HTTPS

The included Nginx config is intentionally HTTP-only until the production domain is known and DNS is pointed at the VPS. Before public launch, add a TLS certificate and HTTPS listener, redirect HTTP to HTTPS, and set `FRONTEND_URL` to the HTTPS origin. Do not expose port 443 until the certificate-backed Nginx config is installed.
