/*
  # Add onboarding profile fields to gig_workers

  1. New Columns
    - work_type (text)
    - city (text)
    - hours_per_day (numeric)
    - vehicle_type (text)

  2. Security
    - Add INSERT policy for authenticated users to create their own profile rows
*/

ALTER TABLE gig_workers
  ADD COLUMN IF NOT EXISTS work_type text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS hours_per_day numeric,
  ADD COLUMN IF NOT EXISTS vehicle_type text;

ALTER TABLE gig_workers
  DROP CONSTRAINT IF EXISTS gig_workers_work_type_check,
  DROP CONSTRAINT IF EXISTS gig_workers_vehicle_type_check,
  DROP CONSTRAINT IF EXISTS gig_workers_hours_per_day_check;

ALTER TABLE gig_workers
  ADD CONSTRAINT gig_workers_work_type_check
    CHECK (work_type IS NULL OR work_type IN ('Food Delivery', 'Grocery Delivery', 'E-commerce Delivery')),
  ADD CONSTRAINT gig_workers_vehicle_type_check
    CHECK (vehicle_type IS NULL OR vehicle_type IN ('Bike', 'Bicycle', 'EV')),
  ADD CONSTRAINT gig_workers_hours_per_day_check
    CHECK (hours_per_day IS NULL OR (hours_per_day > 0 AND hours_per_day <= 24));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gig_workers'
      AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON gig_workers FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
