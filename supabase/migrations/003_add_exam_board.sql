-- Add exam_board column to topics
alter table topics add column if not exists exam_board text;
