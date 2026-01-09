-- 1. Add avatar_url column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Create a new storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up security policies for the storage bucket

-- Allow public access to view avatars
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'avatars' AND auth.uid() = owner );
