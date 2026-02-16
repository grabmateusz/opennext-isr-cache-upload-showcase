# OpenNext Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## D1 Database Setup

This project uses Cloudflare D1 for Next.js ISR (Incremental Static Regeneration) tag caching. Before deploying, you need to initialize the D1 database.

### Prerequisites

1. Make sure you're logged in to Cloudflare:
   ```bash
   wrangler login
   ```

2. Ensure `wrangler` is installed (it's included in devDependencies)

### Initialize the Database

Run the initialization script to create and set up the D1 database:

```bash
npm run db:init
```

This script will:
- Create the D1 database (if it doesn't exist)
- Apply the schema from `db/schema.sql`
- Display the database ID for your `wrangler.jsonc` configuration

If the database is created for the first time, update the `database_id` in `wrangler.jsonc` with the ID provided by the script.

### Database Management Commands

- **Initialize database**: `npm run db:init` - Create and set up the database
- **Apply schema**: `npm run db:schema` - Apply or update the database schema
- **Run query**: `npm run db:query -- --command="SELECT * FROM _next_tag_cache LIMIT 10"` - Execute SQL queries
- **Local database**: `npm run db:local -- --command="SELECT * FROM sqlite_master"` - Query local development database

### Database Schema

The D1 database includes the following table for ISR tag caching:

- **_next_tag_cache**: Stores cache tags and their associated paths with revalidation timestamps
  - `tag`: Cache tag identifier
  - `path`: Associated route path
  - `revalidated_at`: Timestamp of last revalidation

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

**Note**: Make sure to initialize the D1 database (see [D1 Database Setup](#d1-database-setup)) before your first deployment.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/) - learn about Cloudflare D1 database.
- [OpenNext.js Cloudflare](https://opennext.js.org/cloudflare) - deploying Next.js to Cloudflare.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
