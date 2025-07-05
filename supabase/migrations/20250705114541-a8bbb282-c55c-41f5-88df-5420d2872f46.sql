
-- Update the study_type enum to include multiple study types
-- First, let's add a new column to store multiple study types as an array
ALTER TABLE attendance ADD COLUMN study_types text[];

-- Update existing records to convert single study_type to array format
UPDATE attendance SET study_types = ARRAY[study_type::text] WHERE study_types IS NULL;

-- We'll keep the old study_type column for now to avoid breaking existing code
-- but we'll primarily use the new study_types array column
