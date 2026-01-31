DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'time_slot_status') THEN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_enum e
            JOIN pg_type t ON t.oid = e.enumtypid
            WHERE t.typname = 'time_slot_status'
              AND e.enumlabel = 'HELD'
        ) THEN
            ALTER TYPE time_slot_status ADD VALUE 'HELD';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'time_slot_doctor_date_start_uniq'
    ) THEN
        ALTER TABLE time_slot
            ADD CONSTRAINT time_slot_doctor_date_start_uniq
            UNIQUE (doctor_id, date_available, start_time);
    END IF;
END $$;
