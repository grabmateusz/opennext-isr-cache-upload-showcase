# Blog Management API

A Cloudflare Workers API for managing blogs with SQL persistence using Cloudflare D1.

## Features

- ✅ Create, read, update, and delete blog posts
- ✅ SQL-based persistence with Cloudflare D1
- ✅ Automatic pagination support
- ✅ Filter by published status
- ✅ OpenAPI documentation at root URL
- ✅ 2000 pre-seeded blog posts

## Endpoints

- `GET /api/blogs` - List blogs with pagination and filtering
- `POST /api/blogs` - Create a new blog
- `GET /api/blogs/:blogSlug` - Get a single blog by slug
- `DELETE /api/blogs/:blogSlug` - Delete a blog by slug

## Setup

### 1. Create D1 Database

```bash
npx wrangler d1 create blogs-db
```

This will output a database ID. Copy it and update `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "blogs-db",
    "database_id": "YOUR_DATABASE_ID_HERE"
  }
]
```

### 2. Run Migrations

```bash
# Create the blogs table
npx wrangler d1 execute blogs-db --local --file=./migrations/0001_create_blogs_table.sql

# Generate seed data
bash scripts/generate-seed-data.sh

# Load seed data (2000 blogs)
npx wrangler d1 execute blogs-db --local --file=./migrations/seed-data.sql
```

For production:

```bash
# Create the blogs table
npx wrangler d1 execute blogs-db --file=./migrations/0001_create_blogs_table.sql

# Load seed data
npx wrangler d1 execute blogs-db --file=./migrations/seed-data.sql
```

### 3. Development

```bash
# Start local development server
npm run dev

# Deploy to Cloudflare
npm run deploy
```

## Database Schema

```sql
CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    author TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

## Example Usage

### Create a Blog

```bash
curl -X POST http://localhost:8787/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my blog post",
    "author": "John Doe",
    "published": true,
    "created_at": "2026-02-13T10:00:00.000Z"
  }'
```

### List Blogs

```bash
# Get all blogs (paginated)
curl http://localhost:8787/api/blogs

# Filter by published status
curl http://localhost:8787/api/blogs?isPublished=true

# Pagination
curl http://localhost:8787/api/blogs?page=1
```

### Get a Blog

```bash
curl http://localhost:8787/api/blogs/my-first-blog-post
```

### Delete a Blog

```bash
curl -X DELETE http://localhost:8787/api/blogs/my-first-blog-post
```

## Project Structure

```
.
├── src/
│   ├── index.ts           # Main application entry point
│   ├── types.ts           # Type definitions
│   └── endpoints/
│       ├── blogCreate.ts  # Create blog endpoint
│       ├── blogDelete.ts  # Delete blog endpoint
│       ├── blogFetch.ts   # Fetch single blog endpoint
│       └── blogList.ts    # List blogs endpoint
├── migrations/
│   ├── 0001_create_blogs_table.sql  # Database schema
│   ├── 0002_seed_blogs.sql          # Seed migration marker
│   └── seed-data.sql                # Generated seed data (2000 blogs)
├── scripts/
│   ├── generate-seed-data.sh        # Shell script to generate seed data
│   └── seed-blogs.ts                # TypeScript seed generator
├── wrangler.jsonc         # Cloudflare Workers configuration
└── package.json
```

## Technologies

- **Cloudflare Workers**: Serverless execution environment
- **Cloudflare D1**: SQL database (SQLite)
- **Hono**: Fast web framework
- **Chanfana**: OpenAPI integration
- **TypeScript**: Type-safe development

## License

MIT
