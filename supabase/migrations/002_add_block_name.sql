-- Add block_name to cards so each block can carry a human-readable label
-- alongside its numeric block_number.  Nullable so existing rows are unaffected.

alter table cards
  add column if not exists block_name text;
