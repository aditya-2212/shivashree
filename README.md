# Shivashree Developers — Website CMS

A full-stack Next.js website with custom CMS for Shivashree Developers.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** v4
- **Prisma ORM** with **MySQL** (Hostinger)
- **NextAuth.js** (credentials provider)
- **TipTap** WYSIWYG editor
- **PM2** process manager (Hostinger VPS)

---

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — MySQL connection string
- `NEXTAUTH_SECRET` — Random 32-char string (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — Your site URL (e.g. `http://localhost:3000`)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — First admin account credentials

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npm run seed
```

This will create:
- The first admin user (from env variables)
- Default site settings with both office addresses
- The 3 seed properties (Syamala, Mahalakshmi, Aishwaryam)
- Sample FAQ entries

### 5. Start development server

```bash
npm run dev
```

Visit:
- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

---

## Hostinger Deployment

### Prerequisites

- Hostinger VPS or Node.js plan with SSH access
- Node.js 18+ and npm installed
- PM2 installed globally: `npm install -g pm2`
- MySQL database created in hPanel

### Step-by-step Deployment

**1. Upload code**

```bash
# via SFTP or Git
git clone <repo-url> /home/user/shivashree
cd /home/user/shivashree
npm install
```

**2. Set environment variables**

Create `/home/user/shivashree/.env` with production values:

```env
DATABASE_URL="mysql://DB_USER:DB_PASS@localhost:3306/DB_NAME"
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="https://yourdomain.com"
ADMIN_EMAIL="admin@shivashreedev.com"
ADMIN_PASSWORD="YourSecurePassword!"
ADMIN_NAME="Shivashree Admin"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**3. Run database migrations**

```bash
npx prisma migrate deploy
```

**4. Seed the database (first time only)**

```bash
npm run seed
```

**5. Build the application**

```bash
npm run build
```

**6. Start with PM2**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # follow the printed command to enable auto-restart
```

**7. Configure Nginx (if VPS)**

Point your domain to `localhost:3000`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded images directly
    location /uploads {
        alias /home/user/shivashree/public/uploads;
    }
}
```

Enable HTTPS with Certbot: `certbot --nginx -d yourdomain.com`

---

## Admin Panel

Access at `/admin` (redirects to `/admin/dashboard` if logged in).

**Default admin credentials** — set via environment variables during seed.

### Admin Sections

| Section | URL | Description |
|---|---|---|
| Dashboard | `/admin/dashboard` | Overview, quick actions, recent leads |
| Properties | `/admin/properties` | Create, edit, publish property listings |
| Blog | `/admin/blog` | Write and publish blog posts |
| FAQs | `/admin/faqs` | Manage FAQ entries by category |
| Enquiries | `/admin/leads` | View customer enquiries, update status, export CSV |
| Settings | `/admin/settings` | Contact info, WhatsApp number, social links |

---

## Image Uploads

Images are saved to `public/uploads/` on the server filesystem and served via the site's own domain. No third-party storage needed.

On Hostinger, ensure the `public/uploads` directory exists and is writable:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

---

## SEO Notes

- `sitemap.xml` is auto-generated at `/sitemap.xml` — submit this URL to Google Search Console after deployment
- `robots.txt` blocks `/admin` from indexing
- JSON-LD structured data (RealEstateAgent, Residence, Article) is present on relevant pages
- All property page H1s include project name + type + location

### Post-Launch Recommendations

1. **Google Business Profile** — Claim and verify at business.google.com for both Chennai and Kumbakonam locations
2. **Google Search Console** — Submit sitemap.xml URL
3. **GA4** — Verify tracking is active in GA4 Realtime view

---

## Development Notes

- Ambiguous spec decisions are documented in code comments
- All admin routes protected by NextAuth JWT middleware
- Public pages use React Server Components for SEO performance
- Image uploads limited to JPG, PNG, WebP, GIF — max 10MB per file
- Blog reading time is auto-calculated from body word count
