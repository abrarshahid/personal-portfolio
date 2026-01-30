-- Profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb, -- Array of { label, url }
  status JSONB DEFAULT '{"label": "Available", "url": "", "active": true}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert" ON profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON profile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete" ON profile FOR DELETE TO authenticated USING (true);

-- Insert initial data (optional, but good for first load)
INSERT INTO profile (name, role, bio, social_links)
VALUES (
  'Louai Boumediene',
  'Software Engineer / Full-stack Developer',
  'Product-minded software engineer. Building tools for the web, focused on user experience and performance.',
  '[
    {"label": "Twitter", "url": "https://x.com/Louai_Dourov"},
    {"label": "LinkedIn", "url": "https://www.linkedin.com/in/louai-boumediene-018919262/"},
    {"label": "GitHub", "url": "https://github.com/Louai-Zokerburg"}
  ]'::jsonb
);
