# SmartAppointment Backend

## Database migrations (Supabase/Postgres)
This project does not use Flyway. To apply schema updates manually, run the SQL files under `db/migrations` in order.

### Quick apply (psql)
```sh
psql "$DATABASE_URL" -f db/migrations/V1__time_slot_unique_and_status.sql
```

### Supabase SQL editor
1) Open the SQL editor in your Supabase project.
2) Paste the contents of `db/migrations/V1__time_slot_unique_and_status.sql`.
3) Run the script once in your target environment.
