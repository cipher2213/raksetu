/*
  # Create Claims Table

  1. New Tables
    - `claims`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `disruption_score` (integer)
      - `payout_amount` (numeric)
      - `fraud_flagged` (boolean)
      - `claim_status` (text: PENDING, APPROVED, REJECTED)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `claims` table
    - Add policy for authenticated users to view their own claims
    - Add policy for authenticated users to insert their own claims
*/

CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disruption_score integer NOT NULL,
  payout_amount numeric NOT NULL,
  fraud_flagged boolean DEFAULT false,
  claim_status text NOT NULL DEFAULT 'PENDING' CHECK (claim_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
