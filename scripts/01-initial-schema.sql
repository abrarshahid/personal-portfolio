-- Create sections table for dynamic content
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('horizontal_cards', 'vertical_cards', 'tags', 'markdown', 'experience')),
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  image_url TEXT,
  tags TEXT[], -- Array of strings
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experience table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generic items table for simple sections (like tags or text)
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Markdown text or tag label
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow public read, restricted write)
CREATE POLICY "Allow public read access for sections" ON sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow authenticated full access for sections" ON sections FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access for experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for experience" ON experience FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access for content_items" ON content_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for content_items" ON content_items FOR ALL USING (auth.role() = 'authenticated');
