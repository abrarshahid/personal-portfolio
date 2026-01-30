-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone to insert (submit form)
CREATE POLICY "Public insert access" ON messages FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to view/update/delete
CREATE POLICY "Authenticated can select" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update" ON messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete" ON messages FOR DELETE TO authenticated USING (true);
