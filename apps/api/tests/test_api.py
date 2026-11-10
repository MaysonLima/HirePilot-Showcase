from fastapi.testclient import TestClient
import pytest

from app.main import create_app

@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("HIREPILOT_APPLICATIONS_DIR", str(tmp_path / "Aplicacoes"))
    with TestClient(create_app(tmp_path / "test.db")) as test_client:
        yield test_client

def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"

def test_crud_and_stage(client):
    assert client.get("/api/jobs").json() == []
    result = client.post("/api/jobs", json={
        "company": "Empresa de teste", "title": "Estágio em Java",
        "work_mode": "remote", "contract": "internship"
    })
    assert result.status_code == 201
    job_id = result.json()["id"]
    assert len(client.get("/api/jobs").json()) == 1
    assert client.patch(f"/api/jobs/{job_id}", json={"stage": "interviews"}).json()["stage"] == "interviews"
    assert client.get(f"/api/jobs/{job_id}").json()["company"] == "Empresa de teste"
    assert client.delete(f"/api/jobs/{job_id}").status_code == 204
    assert client.get(f"/api/jobs/{job_id}").status_code == 404

def test_validation(client):
    assert client.post("/api/jobs", json={"company": "", "title": "X"}).status_code == 422
    assert client.post("/api/jobs", json={"company": "X", "title": "Y", "stage": "not-a-stage"}).status_code == 422

def test_folder_creation_and_safe_name(client, tmp_path):
    job = client.post("/api/jobs", json={
        "company": "Empresa / Exemplo", "title": "Estágio: Java",
        "description": "Construir APIs"
    }).json()
    result = client.post(f"/api/jobs/{job['id']}/folder")
    assert result.status_code == 200
    from pathlib import Path
    folder = Path(result.json()["path"])
    assert folder.parent == (tmp_path / "Aplicacoes").resolve()
    assert (folder / "vaga.md").read_text(encoding="utf-8").find("Construir APIs") >= 0
    assert client.post(f"/api/jobs/{job['id']}/folder").json()["path"] == str(folder)

def test_delete_never_removes_folder(client):
    job = client.post("/api/jobs", json={"company": "ABC", "title": "Dev"}).json()
    from pathlib import Path
    folder = Path(client.post(f"/api/jobs/{job['id']}/folder").json()["path"])
    client.delete(f"/api/jobs/{job['id']}")
    assert folder.exists()
