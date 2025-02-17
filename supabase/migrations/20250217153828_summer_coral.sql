/*
  # Create user numbers table and security policies

  1. New Tables
    - `user_numbers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `assigned_number` (integer, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_numbers` table
    - Add policies for:
      - Users can read their own number
      - Users can insert their own number (once)
      - Admin can read all numbers
      - Admin can delete all numbers (for reset functionality)
*/

-- Create user_numbers table
CREATE TABLE IF NOT EXISTS user_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  assigned_number integer NOT NULL CHECK (assigned_number BETWEEN 1 AND 12),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(assigned_number)
);

-- Enable RLS
ALTER TABLE user_numbers ENABLE ROW LEVEL SECURITY;

-- Create admin role
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
END $$;

-- Policies for regular users
CREATE POLICY "Users can read own number"
  ON user_numbers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own number once"
  ON user_numbers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM user_numbers WHERE user_id = auth.uid()
    )
  );

-- Policies for admin
CREATE POLICY "Admin can read all numbers"
  ON user_numbers
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admin can delete all numbers"
  ON user_numbers
  FOR DELETE
  TO admin
  USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'is_admin' = 'true'
  );
END;
$$;