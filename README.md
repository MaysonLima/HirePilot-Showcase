<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/hirepilot-wordmark-dark.png" />
    <img src="apps/web/public/hirepilot-wordmark-light.png" alt="HirePilot" width="480" />
  </picture>
</p>

<h1 align="center">HirePilot</h1>
<p align="center"><strong>Seu copiloto na busca pelo próximo emprego.</strong></p>
<p align="center">
  <a href="https://github.com/MaysonLima/HirePilot-Showcase/actions/workflows/ci.yml"><img src="https://github.com/MaysonLima/HirePilot-Showcase/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
</p>

> **Showcase público do MVP v0.1.** Aplicação de uso local, gratuita e em desenvolvimento. O repositório privado de trabalho mantém o desenvolvimento contínuo; este repositório publica versões revisadas do código. **Não é um serviço hospedado nem um instalador Windows pronto.**

## O que já funciona

- **Kanban:** cinco etapas de candidaturas, arrastar e soltar, botões para mover, cadastro, edição e exclusão.
- **Organização:** busca, filtro por modalidade de trabalho, datas, observações, links e exportação CSV.
- **Pastas por candidatura:** criação opcional de uma pasta local com arquivo `vaga.md`, sem apagar documentos quando o cartão é excluído.
- **Configurações:** interface em português, inglês ou espanhol; modo claro, escuro ou automático, com preferências salvas no navegador.
- **API local:** FastAPI, validação com Pydantic, persistência SQLite e documentação OpenAPI.
- **Qualidade:** testes automatizados da API, verificação do build React/TypeScript pelo GitHub Actions.

**O que ainda não está pronto:** Resume AI com Ollama, Job Radar, Interview Coach, Mail Tracker, geração de currículos PDF/DOCX e instalador Windows. As respectivas abas são demonstrações de funcionalidades planejadas, não integrações ativas.

## Tecnologias

| Camada | Stack |
|---|---|
| Interface | React 19, TypeScript, Vite, CSS, Lucide |
| Back-end | Python 3.12, FastAPI, Pydantic |
| Persistência | SQLite local |
| Testes | pytest, GitHub Actions |
| Planejado | Ollama e Tauri |

## Rodando localmente no Windows

Pré-requisitos: **Git, Python 3.12 e Node.js LTS**.

```powershell
git clone https://github.com/MaysonLima/HirePilot-Showcase.git
cd HirePilot-Showcase
```

**Terminal 1 — API**

```powershell
cd apps/api
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — Interface** (abra outro terminal na raiz do projeto)

```powershell
cd apps/web
npm install
npm run dev
```

Acesse **http://127.0.0.1:5173** e teste a API em **http://127.0.0.1:8000/docs**. Os dados pessoais criados pelo usuário ficam fora do Git, no SQLite local.

Para executar testes:

```powershell
# dentro de apps/api
.\.venv\Scripts\python.exe -m pytest -q
# dentro de apps/web
npm run build
```

## Arquitetura

```text
React + TypeScript (localhost:5173)
         | HTTP /api
         v
FastAPI (127.0.0.1:8000)
         |-- SQLite (~/.hirepilot/hirepilot.db)
         +-- Pastas locais de candidaturas
```

## Documentação

- [Tutorial completo para começar](docs/COMECE_AQUI.md)
- [Arquitetura e endpoints](docs/ARQUITETURA.md)
- [Roadmap](docs/ROADMAP.md)
- [Identidade visual](docs/IDENTIDADE_VISUAL.md)
- [Privacidade e segurança](docs/PRIVACIDADE.md)
- [Política de publicação do Showcase](docs/SHOWCASE.md)

## Escopo, privacidade e atualização

Este repositório contém **código, testes, documentação e recursos gráficos**, não dados de candidaturas reais, currículos, credenciais ou tokens. O Showcase é atualizado em marcos relevantes do desenvolvimento, após revisão dos arquivos a publicar. Consulte [a política de publicação](docs/SHOWCASE.md) para saber como ocorre a sincronização.

**Licença:** Apache-2.0 (consulte [LICENSE](LICENSE)).  
**Autor:** [Mayson Lima](https://github.com/MaysonLima).

