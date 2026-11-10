"""Banco de dados SQLite — uma conexão curta por operação."""
from contextlib import contextmanager
from pathlib import Path
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'preparing',
    work_mode TEXT NOT NULL DEFAULT 'unknown',
    contract TEXT NOT NULL DEFAULT 'unknown',
    level TEXT NOT NULL DEFAULT 'unknown',
    outcome TEXT NOT NULL DEFAULT 'unknown',
    location TEXT NOT NULL DEFAULT '',
    source_url TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    applied_at TEXT,
    deadline_at TEXT,
    description TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    folder_path TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_jobs_stage ON jobs(stage);
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);
"""

@contextmanager
def session(path: Path):
    connection = sqlite3.connect(str(path), timeout=15)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

def initialize(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with session(path) as connection:
        connection.executescript(SCHEMA)
