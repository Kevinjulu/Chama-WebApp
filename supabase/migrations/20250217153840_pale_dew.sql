/*
  # Create database triggers

  1. Triggers
    - Log number assignments
    - Log number resets
    - Verify admin for reset operations

  2. Functions
    - Trigger functions for logging
    - Admin verification function
*/

-- Trigger for logging number assignments
CREATE OR REPLACE FUNCTION log_number_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM log_activity(
    'number_assigned',
    jsonb_build_object(
      'assigned_number', NEW.assigned_number
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_number_assignment_trigger
AFTER INSERT ON user_numbers
FOR EACH ROW
EXECUTE FUNCTION log_number_assignment();

-- Trigger for logging number resets
CREATE OR REPLACE FUNCTION log_number_reset()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (SELECT is_admin()) THEN
    PERFORM log_activity('numbers_reset');
    RETURN OLD;
  ELSE
    RAISE EXCEPTION 'Only admins can reset numbers';
  END IF;
END;
$$;

CREATE TRIGGER log_number_reset_trigger
BEFORE DELETE ON user_numbers
FOR EACH STATEMENT
EXECUTE FUNCTION log_number_reset();