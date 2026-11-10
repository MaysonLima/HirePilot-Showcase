# Tutorial HirePilot — do zero no Windows

Este tutorial assume que você está começando. **Não precisa entender todos os comandos agora.** Vamos rodar duas partes: a API em Python (guarda os dados) e a interface React (o que aparece na tela).

## 1. Instalações

1. Instale o **Git**: https://git-scm.com/downloads
2. Instale o **Python 3.12**: https://www.python.org/downloads/ — marque **Add Python to PATH** durante a instalação.
3. Instale o **Node.js LTS**: https://nodejs.org/
4. Instale o **Visual Studio Code**: https://code.visualstudio.com/

Abra o **PowerShell** e confira:

```powershell
git --version
py --version
node --version
npm --version
```

Se algum comando não funcionar, feche e reabra o terminal após instalar.

## 2. Baixar o projeto

Escolha uma pasta no seu PC. No PowerShell:

```powershell
cd "$HOME\Documents"
git clone https://github.com/MaysonLima/HirePilot-Showcase.git
cd HirePilot-Showcase
code .
```

O Showcase é público: você pode cloná-lo sem acesso ao repositório de desenvolvimento. Não coloque senhas, credenciais ou currículos nos arquivos versionados.

## 3. Iniciar a API (terminal 1)

No VS Code, abra **Terminal > Novo terminal**:

```powershell
cd apps/api
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Veja se a API responde em http://127.0.0.1:8000/api/health e explore os endpoints em http://127.0.0.1:8000/docs.

> O banco fica, por padrão, em `C:\Users\SEU_USUARIO\.hirepilot\hirepilot.db`. Nunca envie esse arquivo ao GitHub.

## 4. Iniciar o site (terminal 2)

Abra **outro** terminal no VS Code. A partir da raiz do projeto:

```powershell
cd apps/web
npm install
npm run dev
```

Abra **http://127.0.0.1:5173**. Crie um cartão e mova-o entre colunas. Feche e reabra a página: o cartão deve continuar lá.

**Importante:** deixe os dois terminais abertos enquanto usar o HirePilot. Para encerrar, pressione `Ctrl+C` em cada terminal.

## 5. Personalize a aparência e o idioma

No menu lateral do HirePilot, clique em **Configurações**.

- **Aparência:** selecione Claro, Escuro ou Automático (segue o tema do Windows).
- **Idioma:** escolha Português (Brasil), English ou Español.
- A mudança é imediata e fica salva no navegador (localStorage); não altera os registros no SQLite.
- As descrições, nomes de empresas e notas que você cadastrou não são traduzidos automaticamente.
- Se você limpar os dados locais do navegador, essas preferências podem voltar ao padrão.

## 6. Criar a pasta de uma candidatura

Abra um cartão existente e clique em **Criar pasta**. A aplicação cria uma pasta com os detalhes da vaga e anotações. O caminho padrão é:

```text
C:\Users\SEU_USUARIO\Documents\HirePilot\Aplicacoes\Empresa - Vaga\vaga.md
```

Para escolher outra pasta, antes de iniciar a API no PowerShell, use:

```powershell
$env:HIREPILOT_APPLICATIONS_DIR = "$HOME\Documents\Aplicacoes"
```

Depois execute o comando do Uvicorn. Essa configuração vale para aquele terminal. A aplicação não copia nem adapta o currículo na versão 0.1.

## 7. Testar e verificar o projeto

No terminal da API (pare o servidor com `Ctrl+C` antes, se desejar):

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

No terminal da interface:

```powershell
npm run build
```

## 8. Comandos essenciais do Git

```powershell
git status
git pull
git add .
git commit -m "feat: minha primeira melhoria"
git push
```

**Antes de `git add .`**, confira se não há arquivos pessoais, currículos ou credenciais aparecendo no `git status`.

## Problemas comuns

- **Página não abre:** confirme que o comando `npm run dev` está rodando.
- **API indisponível:** confira se a API está ativa na porta 8000.
- **Porta em uso:** feche outro servidor antigo antes de iniciar.
- **Erro de dependência:** execute `npm install` na pasta `apps/web` e `pip install -r requirements-dev.txt` na pasta `apps/api`.
- **Python não reconhecido:** reabra o terminal ou reinstale com a opção PATH.
- **Pasta não criada:** confira permissão para gravar no local e veja a mensagem de erro.

## Sua primeira missão

1. Abra o projeto no VS Code.
2. Inicie os dois servidores.
3. Crie uma vaga fictícia e salve.
4. Mova o cartão para outra etapa.
5. Crie a pasta, verifique o `vaga.md` e exporte um CSV.

Pronto! Essa é a base que vamos evoluir juntos.
