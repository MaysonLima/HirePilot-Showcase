# Arquitetura inicial

```text
Navegador local (React/Vite :5173)
          |
          | HTTP /api (proxy do Vite)
          v
    FastAPI (127.0.0.1:8000)
          |
          +-- SQLite (~/.hirepilot/hirepilot.db)
          |
          +-- Pasta de candidaturas local
```

## Separação de responsabilidades

- **Front-end:** interface, quadro, formulários, busca e filtros visuais.
- **API:** validação com Pydantic, lógica de candidaturas, persistência e arquivos.
- **SQLite:** registros das vagas, status, datas e anotações.
- **Pasta local:** anotações por candidatura; currículos virão na v0.2.

## Endpoints implementados

| Método | Caminho | Função |
| --- | --- | --- |
| GET | `/api/health` | Saúde da API |
| GET | `/api/jobs` | Listar vagas |
| GET | `/api/jobs/{id}` | Obter vaga |
| POST | `/api/jobs` | Criar |
| PATCH | `/api/jobs/{id}` | Atualizar ou mover |
| DELETE | `/api/jobs/{id}` | Excluir registro, sem excluir arquivos |
| POST | `/api/jobs/{id}/folder` | Criar pasta e `vaga.md` |

A documentação OpenAPI é exposta pela própria API em `http://127.0.0.1:8000/docs`.

## Variáveis de ambiente

| Nome | Uso | Padrão |
| --- | --- | --- |
| `HIREPILOT_DB_PATH` | Local do banco SQLite | `~/.hirepilot/hirepilot.db` |
| `HIREPILOT_APPLICATIONS_DIR` | Pasta raiz das candidaturas | `~/Documents/HirePilot/Aplicacoes` |

## Decisões de implementação

- Escopo local e individual; **não exponha o servidor na rede**.
- A API inicia vinculada a `127.0.0.1` no tutorial.
- Os valores permitidos são validados no back-end.
- O nome de pastas é sanitizado para evitar caracteres inválidos no Windows.
- A pasta de documentos não é apagada ao remover o cartão.
- A criação de pasta é opcional; não ocorre ao cadastrar a vaga.
- O aplicativo não armazena senhas nem integra contas na v0.1.

## Próximos cuidados

- Lockfile de dependências, migrações SQL e testes de integração ponta a ponta.
- Endurecimento da API local (origem, acesso e autenticação conforme empacotamento).
- Backup consistente dos metadados e documentos.
- Limites de dados, rejeição de URLs perigosas em integrações e permissões OAuth mínimas.

Para o plano de módulos, veja [ROADMAP.md](ROADMAP.md).
