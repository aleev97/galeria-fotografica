-- Migration number: 0001 	 2026-11-24T13:39:46.821Z
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  description TEXT,
  collection TEXT NOT NULL CHECK (collection IN ('cosmos', 'earth', 'wildlife', 'details')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_photos_collection ON photos (published, collection, sort_order);
CREATE INDEX idx_photos_featured ON photos (published, featured, sort_order);