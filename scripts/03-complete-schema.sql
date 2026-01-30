-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SECTIONS TABLE
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  content TEXT, -- For markdown sections
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop the strict check constraint if it exists to allow flexibility
DO $$ 
BEGIN 
    ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Add content column if it doesn't exist
ALTER TABLE sections ADD COLUMN IF NOT EXISTS content TEXT;

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  image_url TEXT,
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE projects ALTER COLUMN section_id DROP NOT NULL;

-- 3. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to experience
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_url TEXT;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS technologies TEXT[];
ALTER TABLE experience ALTER COLUMN section_id DROP NOT NULL;

-- 4. CONTENT ITEMS TABLE
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROFILE TABLE
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  role TEXT,
  bio TEXT,
  image_url TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  status JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RLS & POLICIES
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Helper function to drop policy if exists
CREATE OR REPLACE FUNCTION drop_policy_if_exists(policy_name text, table_name text) 
RETURNS void AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Sections Policies
SELECT drop_policy_if_exists('Allow public read access for sections', 'sections');
CREATE POLICY "Allow public read access for sections" ON sections FOR SELECT USING (is_visible = true);

SELECT drop_policy_if_exists('Allow authenticated full access for sections', 'sections');
CREATE POLICY "Allow authenticated full access for sections" ON sections FOR ALL USING (auth.role() = 'authenticated');

-- Projects Policies
SELECT drop_policy_if_exists('Allow public read access for projects', 'projects');
CREATE POLICY "Allow public read access for projects" ON projects FOR SELECT USING (true);

SELECT drop_policy_if_exists('Allow authenticated full access for projects', 'projects');
CREATE POLICY "Allow authenticated full access for projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Experience Policies
SELECT drop_policy_if_exists('Allow public read access for experience', 'experience');
CREATE POLICY "Allow public read access for experience" ON experience FOR SELECT USING (true);

SELECT drop_policy_if_exists('Allow authenticated full access for experience', 'experience');
CREATE POLICY "Allow authenticated full access for experience" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Content Items Policies
SELECT drop_policy_if_exists('Allow public read access for content_items', 'content_items');
CREATE POLICY "Allow public read access for content_items" ON content_items FOR SELECT USING (true);

SELECT drop_policy_if_exists('Allow authenticated full access for content_items', 'content_items');
CREATE POLICY "Allow authenticated full access for content_items" ON content_items FOR ALL USING (auth.role() = 'authenticated');

-- Profile Policies
SELECT drop_policy_if_exists('Allow public read access for profile', 'profile');
CREATE POLICY "Allow public read access for profile" ON profile FOR SELECT USING (true);

SELECT drop_policy_if_exists('Allow authenticated full access for profile', 'profile');
CREATE POLICY "Allow authenticated full access for profile" ON profile FOR ALL USING (auth.role() = 'authenticated');

-- Messages Policies
SELECT drop_policy_if_exists('Allow authenticated read access for messages', 'messages');
CREATE POLICY "Allow authenticated read access for messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');

SELECT drop_policy_if_exists('Allow public insert access for messages', 'messages');
CREATE POLICY "Allow public insert access for messages" ON messages FOR INSERT WITH CHECK (true);
