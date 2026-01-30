-- Add content column to projects for markdown body
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;

-- Make section_id nullable for projects (NULL = Default List)
ALTER TABLE projects ALTER COLUMN section_id DROP NOT NULL;

-- Make section_id nullable for experience (NULL = Default List)
ALTER TABLE experience ALTER COLUMN section_id DROP NOT NULL;
