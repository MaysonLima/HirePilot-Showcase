# Publicação e sincronização do Showcase

Este repositório é uma **cópia pública revisada** de versões importantes do projeto HirePilot. O repositório de desenvolvimento permanece privado para permitir experimentação e organizar trabalho em andamento.

## O que é publicado

- Código-fonte React/TypeScript e FastAPI/Python do MVP;
- Arquivos necessários para rodar o projeto localmente;
- Testes automatizados e workflow CI;
- Imagens oficiais da identidade visual;
- Documentação de arquitetura, uso, privacidade e roadmap.

## O que não é publicado

- Bancos de dados SQLite locais e suas cópias;
- Currículos, fichas de candidatos e informações de candidaturas reais;
- Pastas de empresas/vagas, PDFs/DOCX pessoais, credenciais e tokens;
- Ambientes virtuais, `node_modules`, arquivos temporários e logs.

Os padrões de `.gitignore` ajudam, mas não substituem revisão dos arquivos. **Nunca publique dados reais apenas para demonstrar o aplicativo.**

## Atualizações

O Showcase representa um **marco versionado**, não todas as alterações experimentais do repositório privado. A revisão do conteúdo deve acontecer antes de qualquer nova publicação. O arquivo `.showcase-source-commit` identifica o commit privado do qual a cópia pública foi produzida. O código publicado pode receber ajustes apenas na documentação pública (por exemplo, os links de clonagem).

A sincronização posterior pode ser realizada manualmente por um mantenedor ou via workflow de publicação no repositório privado, configurado com uma credencial restrita ao `HirePilot-Showcase`. A disponibilidade de um workflow não implica que uma credencial esteja configurada: sem ela, a publicação automática não acontece.

## Limitações e honestidade da demonstração

- O MVP v0.1 tem Kanban, CRUD, SQLite, criação opcional de pastas, exportação CSV e preferências de interface.
- As demais áreas da navegação representam funcionalidades planejadas, **ainda não operacionais**.
- A interface precisa de uma API local em execução na porta 8000; não existe implantação pública pronta.
- A documentação não promete equivalência com um produto final, auditoria de segurança ou instalador Windows.

Para executar o projeto, consulte [COMECE_AQUI.md](COMECE_AQUI.md).
