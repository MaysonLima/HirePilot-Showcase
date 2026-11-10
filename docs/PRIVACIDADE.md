# Privacidade, dados e segurança

O HirePilot foi concebido para uso pessoal. **Não envie currículos, e-mails, tokens ou dados de terceiros ao repositório.**

## Versão 0.1

- Os dados de candidaturas são mantidos em SQLite local.
- As pastas de candidaturas são criadas somente quando você clicar no botão.
- Apagar uma vaga no Kanban **não apaga a pasta**.
- O código atual não envia currículo nem lê e-mail.
- A aplicação web é servida localmente por Vite durante desenvolvimento.
- Não ative `--host 0.0.0.0` nem exponha a API à internet.

## Futuras integrações

- Ollama: IA local preferencial; não incluir histórico ou dados pessoais em logs.
- Gmail: OAuth de leitura, escopo mínimo, armazenamento seguro de tokens e opção de revogação.
- Job Radar: apenas fontes públicas e acesso permitido; respeitar termos, limites e privacidade.
- Backup: exportação completa e restauração testável, idealmente com proteção por senha quando contiver dados sensíveis.
- Resumo de empresas: informações verificáveis, fontes e datas. A IA não deve inventar fatos.

## Cuidados

O `.gitignore` reduz a chance de publicar dados pessoais, mas **não substitui revisar o `git status` e o commit antes do push**. Se credenciais forem expostas, revogue e substitua imediatamente.

O projeto está em desenvolvimento e ainda não passou por uma auditoria de segurança. **O código do Showcase é público, mas seus dados reais devem permanecer apenas no computador**; não compartilhe o banco de dados, currículos, backups, credenciais nem logs pessoais.
