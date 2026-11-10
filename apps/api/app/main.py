"""API local do HirePilot. Execute com uvicorn app.main:app --reload."""
from datetime import datetime, timezone
from pathlib import Path
import os
import sqlite3

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from .db import initialize, session
from .folders import create_application_folder
from .schemas import FolderResult, Job, JobCreate, JobUpdate

COLUMNS = (
    "company", "title", "stage", "work_mode", "contract", "level",
    "outcome", "location", "source_url", "salary_min", "salary_max",
    "applied_at", "deadline_at", "description", "notes"
)

def now() -> str:
    return datetime.now(timezone.utc).isoformat()

def serialize(values: dict) -> dict:
    return {key: str(value) if value is not None and key in
            {"source_url", "applied_at", "deadline_at"} else value
            for key, value in values.items()}

def create_app(db_path: Path | None = None) -> FastAPI:
    database = Path(db_path or os.getenv("HIREPILOT_DB_PATH") or (
        Path.home() / ".hirepilot" / "hirepilot.db"
    )).expanduser()
    initialize(database)
    app = FastAPI(title="HirePilot API", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Content-Type"],
    )

    def find(job_id: int) -> dict:
        with session(database) as db:
            row = db.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Candidatura não encontrada.")
        return dict(row)

    @app.get("/api/health")
    def health():
        return {"status": "ok", "version": "0.1.0"}

    @app.get("/api/jobs", response_model=list[Job])
    def list_jobs():
        with session(database) as db:
            rows = db.execute(
                "SELECT * FROM jobs ORDER BY updated_at DESC, id DESC"
            ).fetchall()
        return [dict(row) for row in rows]

    @app.get("/api/jobs/{job_id}", response_model=Job)
    def get_job(job_id: int):
        return find(job_id)

    @app.post("/api/jobs", response_model=Job, status_code=201)
    def add_job(payload: JobCreate):
        values = serialize(payload.model_dump(mode="python"))
        values["created_at"] = now()
        values["updated_at"] = values["created_at"]
        keys = list(values)
        columns = ", ".join(keys)
        placeholders = ", ".join("?" for _ in keys)
        with session(database) as db:
            cursor = db.execute(
                f"INSERT INTO jobs ({columns}) VALUES ({placeholders})",
                tuple(values[key] for key in keys),
            )
            job_id = cursor.lastrowid
        return find(job_id)

    @app.patch("/api/jobs/{job_id}", response_model=Job)
    def edit_job(job_id: int, payload: JobUpdate):
        find(job_id)
        data = serialize(payload.model_dump(exclude_unset=True))
        # Campos obrigatórios nunca podem se tornar NULL.
        required = {"company", "title", "stage", "work_mode", "contract",
                    "level", "outcome", "location", "description", "notes"}
        if any(key in required and value is None for key, value in data.items()):
            raise HTTPException(status_code=422, detail="Campo obrigatório nulo.")
        if not data:
            return find(job_id)
        data["updated_at"] = now()
        assignment = ", ".join(f"{key}=?" for key in data)
        with session(database) as db:
            db.execute(
                f"UPDATE jobs SET {assignment} WHERE id=?",
                (*data.values(), job_id),
            )
        return find(job_id)

    @app.delete("/api/jobs/{job_id}", status_code=204)
    def delete_job(job_id: int):
        find(job_id)
        with session(database) as db:
            db.execute("DELETE FROM jobs WHERE id=?", (job_id,))
        # Apagar um cartão NUNCA apaga os documentos da pasta da candidatura.
        return Response(status_code=204)

    @app.post("/api/jobs/{job_id}/folder", response_model=FolderResult)
    def save_folder(job_id: int):
        job = find(job_id)
        try:
            folder = create_application_folder(job)
        except (OSError, ValueError) as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        with session(database) as db:
            db.execute(
                "UPDATE jobs SET folder_path=?, updated_at=? WHERE id=?",
                (str(folder), now(), job_id),
            )
        return {"path": str(folder)}

    return app

app = create_app()
