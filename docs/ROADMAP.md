# Roadmap do HirePilot

## Visão do produto

Aplicativo de carreira **pessoal, gratuito e local**, que ajuda a descobrir vagas, adaptar currículos verdadeiros, preparar entrevistas e acompanhar processos.

## v0.1 — Fundação (implementação inicial)

- [x] React + TypeScript + FastAPI + SQLite
- [x] Kanban com cinco etapas e arrastar/soltar
- [x] CRUD completo de candidaturas
- [x] Filtros e busca local
- [x] Criação de pasta por empresa/cargo e arquivo vaga.md
- [x] Exportação CSV
- [x] Testes iniciais da API
- [ ] Revisão manual e testes no Windows real
- [ ] Melhorias de acessibilidade e experiência mobile
- [ ] Registro de histórico de movimentações

## v0.2 — Resume AI

- [ ] Currículo mestre editável e protegido
- [ ] Importação PDF/DOCX com revisão de dados extraídos
- [ ] Ollama e configuração do modelo local
- [ ] Análise dos requisitos com evidências
- [ ] Diff visual e aceite/rejeição de alterações
- [ ] Exportação PDF/DOCX respeitando ATS
- [ ] Guardar a versão enviada na pasta da candidatura

## v0.3 — Job Radar

- [ ] Conectores para APIs públicas e páginas de carreiras permitidas
- [ ] Filtros de modalidade, tipo, salário, localização e senioridade
- [ ] Filtro por data verificável (não inventar a data)
- [ ] Deduplicação por URL e características do anúncio
- [ ] Checagem de elegibilidade e vagas suspeitas
- [ ] Buscas salvas, atualização e alertas locais
- [ ] Origem rastreável e respeito a limites/termos das fontes

## v0.4 — Interview Coach

- [ ] Pitch de 30/60/90 segundos por vaga
- [ ] Resumo pesquisado da empresa com fontes
- [ ] Perguntas técnicas e comportamentais contextualizadas
- [ ] Feedback das respostas, explicações e plano de estudos
- [ ] Histórico de simulações e progresso

## v0.5 — Mail Tracker

- [ ] Login Google OAuth somente leitura
- [ ] Associação de e-mails às candidaturas com confirmação
- [ ] Identificação de entrevistas, testes, retornos e prazos
- [ ] Proteção dos tokens locais e botão Desconectar
- [ ] Avisos sem alteração automática irreversível

## v1.0 — Aplicativo Windows

- [ ] Instalação e atualizações via Tauri
- [ ] Dashboard e relatórios completos
- [ ] Assistente consultando apenas dados permitidos
- [ ] Exportar/importar backup com recuperação testada
- [ ] Testes completos e revisão de segurança

## Fora do escopo atual

- Envio em massa ou automático de candidaturas.
- Scraping não autorizado de plataformas.
- Pontuação ATS fictícia apresentada como medição real.
- Alterar o currículo inventando qualificações.
- Cobranças, assinaturas ou serviços em nuvem obrigatórios.

## Regras de priorização

Uma versão só é considerada pronta após funcionar localmente, preservar os dados e ter instruções reproduzíveis. Ideias novas entram no backlog sem interromper a v0.1.
