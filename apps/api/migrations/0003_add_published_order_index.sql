-- Migration number: 0003 	 2026-11-27T01:26:50.071Z
CREATE INDEX idx_photos_published_order ON photos (published, sort_order);