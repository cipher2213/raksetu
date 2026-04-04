/*
  # Create Gig Workers Table

  1. New Tables
    - `gig_workers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `weekly_earnings` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `gig_workers` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS gig_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  weekly_earnings numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(email)
);

ALTER TABLE gig_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON gig_workers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON gig_workers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
