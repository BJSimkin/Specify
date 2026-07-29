# Specify

An open-source platform for hosting AI system requirements packages — like GitHub/HuggingFace but for AI governance and functional specifications.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account
- GitHub OAuth app credentials
- Google OAuth app credentials

## 1. Clone and Install

```bash
git clone https://github.com/your-org/specify.git
cd specify
npm install
```

## 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database** and copy your `DATABASE_URL` (use the "URI" format with `?pgbouncer=true` for production, plain URI for local dev)
3. Go to **Storage → New bucket**, create a bucket named `packages` and set it to **public**
4. Go to **Project Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL
   - `SUPABASE_SERVICE_KEY` — the `service_role` secret key (keep this server-side only)

## 3. GitHub OAuth Setup

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL** to `http://localhost:3000` (or your production URL)
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**

## 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create **OAuth 2.0 Client ID** (Web application)
3. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy **Client ID** and **Client Secret**

## 5. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string from Supabase |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of your app (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |

## 6. Database Setup

Push the Prisma schema to your Supabase database:

```bash
npx prisma db push
```

To view and edit data visually:

```bash
npm run db:studio
```

## 7. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 8. Vercel Deployment

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In the **Environment Variables** section, add all variables from `.env.example`
4. Set `NEXTAUTH_URL` to your production Vercel URL (e.g. `https://specify.vercel.app`)
5. Update your GitHub and Google OAuth callback URLs to point to the production domain
6. Click **Deploy**

## 9. Granting Certifications

Certifications (TÜV SÜD, BSI, EU AI Office) are granted by admins only. To grant a certification manually:

1. Run `npm run db:studio` locally (with production `DATABASE_URL`)
2. Open the `Certification` table
3. Create a new record with:
   - `packageId` — the ID of the package
   - `certifier` — one of `TUV_SUD`, `BSI`, `EU_AI_OFFICE`
   - `grantedById` — your admin user ID
   - `notes` — optional notes
4. Save the record

In the future, an admin API endpoint will be added for this workflow.

## Package YAML Format

Packages are defined in a structured YAML format. See the [schema documentation](https://specify.dev/docs/yaml-schema) for the full specification.

```yaml
specify_version: "0.1"
metadata:
  name: "my-ai-package"
  version: "0.1.0"
  description: "Description of your AI system requirements"
  license: "MIT"
  authors:
    - name: "Your Name"
      org: "Your Org"
requirements:
  - id: "REQ-001"
    title: "My first requirement"
    tags: ["system"]
    obligation: "shall"
    body: |
      Detailed requirement description.
```

## License

MIT
