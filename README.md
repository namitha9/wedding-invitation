# Wedding Invitation — GitHub + Cloudflare Workers + D1

This project is set up so the entire wedding website and RSVP API are deployed as one Cloudflare Worker.

## Architecture

GitHub → Cloudflare Workers Builds → Cloudflare Worker → D1

The website files live in `public/`. The backend API lives in `src/index.js`. RSVP data is stored in Cloudflare D1.

## One-time setup

### 1. Create the GitHub repository

Create a new GitHub repository and upload all files in this folder.
Done

### 2. Create the D1 database

In Cloudflare Dashboard:

Workers & Pages → D1 SQL Databases → Create database

Name it:

`wedding-invitation-db`

Copy the database ID into `wrangler.jsonc`, replacing:

`REPLACE_WITH_DATABASE_ID`

### 3. Create the table

From a terminal in this repository:

```bash
npx wrangler login
npx wrangler d1 execute wedding-invitation-db --remote --file=./migrations/0001_init.sql
```

### 4. Connect GitHub to Cloudflare

Cloudflare Dashboard → Workers & Pages → Create application → Import an existing Git repository.

Select the GitHub repository.

Use:

Build/deploy command:

```bash
npx wrangler deploy
```

No separate frontend deployment is needed.

### 5. Future changes

After the initial setup, edit the project and push to GitHub:

```bash
git add .
git commit -m "Update wedding website"
git push
```

Cloudflare automatically deploys the new version.

## RSVP data

The form sends submissions to:

`POST /api/rsvp`

The Worker stores them in the D1 table `rsvps`.

View and manage them in:

Cloudflare Dashboard → D1 SQL Databases → wedding-invitation-db → Browse data → `rsvps`

Deploying a new website version does NOT delete the D1 data.

## Important

Keep the D1 `database_id` in `wrangler.jsonc`. Do not create a new database every time you deploy.
