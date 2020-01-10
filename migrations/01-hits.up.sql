CREATE TABLE IF NOT EXISTS all_hits (
  id UInt64,
  client_id UUID,
  action String,
  subject String,
  device String,
  event_date Date,
  created_at DateTime
) ENGINE = MergeTree(event_date, (id, event_date), 8192);


