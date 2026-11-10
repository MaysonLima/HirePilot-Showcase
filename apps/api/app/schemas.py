"""Validação dos dados de candidaturas."""
from datetime import date
from typing import Literal
from pydantic import BaseModel, Field, HttpUrl, ConfigDict

Stage = Literal["preparing", "applied", "tests", "interviews", "closed"]
WorkMode = Literal["remote", "hybrid", "onsite", "unknown"]
Contract = Literal["clt", "pj", "internship", "freelance", "unknown"]
Level = Literal["internship", "trainee", "junior", "mid", "senior", "unknown"]
Outcome = Literal["approved", "rejected", "withdrawn", "unknown"]

class JobCreate(BaseModel):
    company: str = Field(min_length=1, max_length=160)
    title: str = Field(min_length=1, max_length=200)
    stage: Stage = "preparing"
    work_mode: WorkMode = "unknown"
    contract: Contract = "unknown"
    level: Level = "unknown"
    outcome: Outcome = "unknown"
    location: str = Field(default="", max_length=180)
    source_url: HttpUrl | None = None
    salary_min: int | None = Field(default=None, ge=0, le=100000000)
    salary_max: int | None = Field(default=None, ge=0, le=100000000)
    applied_at: date | None = None
    deadline_at: date | None = None
    description: str = Field(default="", max_length=20000)
    notes: str = Field(default="", max_length=20000)

class JobUpdate(BaseModel):
    company: str | None = Field(default=None, min_length=1, max_length=160)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    stage: Stage | None = None
    work_mode: WorkMode | None = None
    contract: Contract | None = None
    level: Level | None = None
    outcome: Outcome | None = None
    location: str | None = Field(default=None, max_length=180)
    source_url: HttpUrl | None = None
    salary_min: int | None = Field(default=None, ge=0, le=100000000)
    salary_max: int | None = Field(default=None, ge=0, le=100000000)
    applied_at: date | None = None
    deadline_at: date | None = None
    description: str | None = Field(default=None, max_length=20000)
    notes: str | None = Field(default=None, max_length=20000)

class Job(JobCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    folder_path: str | None = None
    created_at: str
    updated_at: str

class FolderResult(BaseModel):
    path: str
