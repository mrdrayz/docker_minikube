ALTER TABLE projects
    ADD COLUMN description TEXT NOT NULL DEFAULT ''
    CHECK (char_length(description) <= 500);
