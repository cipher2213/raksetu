/*
  # Create Disruption Checks Table

  1. New Tables
    - `disruption_checks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `disruption_score` (integer, 0-100)
      - `status` (text: LOW, MEDIUM, HIGH)
      - `checked_at` (timestamp)

  2. Security
    - Enable RLS on `disruption_checks` table
    - Add policy for authenticated users to view their own checks
    - Add policy for authenticated users to insert their own checks
*/

CREATE TABLE IF NOT EXISTS disruption_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disruption_score integer NOT NULL CHECK (disruption_score >= 0 AND disruption_score <= 100),
  status text NOT NULL CHECK (status IN ('LOW', 'MEDIUM', 'HIGH')),
  checked_at timestamptz DEFAULT now()
);

ALTER TABLE disruption_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disruption checks"
  ON disruption_checks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert disruption checks"
  ON disruption_checks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
