-- D1 Database Schema for Next.js ISR Tag Cache
-- This schema is used by OpenNext.js for Incremental Static Regeneration (ISR) caching

-- Table for storing cache tags and their associated paths
CREATE TABLE IF NOT EXISTS _next_tag_cache (
    tag TEXT NOT NULL,
    path TEXT NOT NULL,
    revalidated_at INTEGER NOT NULL,
    PRIMARY KEY (tag, path)
);

-- Index for faster lookups by tag
CREATE INDEX IF NOT EXISTS idx_tag ON _next_tag_cache(tag);

-- Index for faster lookups by revalidation time
CREATE INDEX IF NOT EXISTS idx_revalidated_at ON _next_tag_cache(revalidated_at);
