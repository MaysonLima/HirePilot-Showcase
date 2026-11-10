"""Arquivamento local e seguro dos metadados de uma vaga."""
from pathlib import Path
import os
import re

WINDOWS_RESERVED = {"CON", "PRN", "AUX", "NUL"} | {
    f"{prefix}{i}" for prefix in ("COM", "LPT") for i in range(1, 10)
}

def safe_name(value: str) -> str:
    value = re.sub(r'[<>:"/\\|?*\x00-\x1f]', " ", value).strip(" .")
    value = re.sub(r"\s+", " ", value)[:75].strip(" .")
    if not value or value.upper().split(".")[0] in WINDOWS_RESERVED or value in (".", ".."):
        return "Sem nome"
    return value

def application_root() -> Path:
    selected = os.getenv("HIREPILOT_APPLICATIONS_DIR")
    return Path(selected).expanduser().resolve() if selected else (
        Path.home() / "Documents" / "HirePilot" / "Aplicacoes"
    ).resolve()

def create_application_folder(job: dict) -> Path:
    root = application_root()
    root.mkdir(parents=True, exist_ok=True)
    existing = job.get("folder_path")
    if existing:
        path = Path(existing).resolve()
        if path.parent != root:
            raise ValueError("A pasta anterior não pertence à pasta configurada.")
    else:
        base = safe_name(job["company"]) + " - " + safe_name(job["title"])
        path = root / base
        # Evita compartilhar uma mesma pasta entre candidaturas duplicadas.
        if path.exists():
            path = root / (base + " - " + str(job["id"]))
    path.mkdir(parents=True, exist_ok=True)
    details = [
        "# " + job["company"] + " — " + job["title"],
        "", "Etapa: " + job["stage"],
        "Link: " + (job.get("source_url") or "Não informado"),
        "Prazo: " + (job.get("deadline_at") or "Não informado"),
        "", "## Descrição da vaga", job.get("description") or "Não informada",
        "", "## Anotações", job.get("notes") or "Nenhuma",
    ]
    (path / "vaga.md").write_text("\n".join(details) + "\n", encoding="utf-8")
    return path
