# Identidade visual · HirePilot Flight Deck

> Versão inicial de identidade visual. Adaptação de conceitos do guia de referência fornecido para o HirePilot, **sem copiar as cores ou a identidade do Duolingo**.

## Personalidade

Uma ferramenta de carreira precisa transmitir confiança, mas não precisa ser fria. Nossa direção é: **amigável, clara, organizada, otimista e profissional**. O usuário deve sentir que está avançando uma candidatura por vez, sem pressão de métricas artificiais.

## Cores

| Token | Valor | Uso |
|---|---|---|
| Azul piloto | `#3165E8` | Botão principal, marca e itens ativos |
| Azul profundo | `#214BB9` | Hover e texto em superfície azul-clara |
| Azul suave | `#EAF0FF` | Seleção e destaques discretos |
| Menta | `#16AC92` | Avanço, indicador de ambiente local e sucesso |
| Menta suave | `#DFF8F0` | Etiquetas e confirmações |
| Amarelo-sol | `#F6C453` | Datas, atenção leve e progresso |
| Lavanda | `#886BDA` | Etapas de entrevista e destaques secundários |
| Texto principal | `#24314D` | Títulos e corpo de alta importância |
| Texto secundário | `#596985` | Descrições e metadados |
| Fundo | `#F7F9FE` | Tela do aplicativo |
| Superfície | `#FFFFFF` | Cartões, sidebar e modal |
| Borda | `#D7E0ED` | Divisão e contorno dos componentes |

## Tipografia

**Nunito** (400–900) para toda a aplicação. Alternativas offline: Segoe UI e fontes nativas do sistema. Títulos 900, botões e rótulos 800/900 e texto de apoio 600/700. Palavras em caixa alta somente em pequenos rótulos de navegação, não em parágrafos.

## Forma e componentes

- Botões grandes com cantos arredondados (13px), borda firme e sensação de pressionar.
- Cartões em branco, bordas de 2px, raio 18px e sem gradientes.
- Layout de produtividade (Kanban com cinco colunas); **não** copiar o layout de uma página de marketing/curso.
- Cartões de candidatura com nome da empresa, vaga, etiquetas e ações claras.
- Cor expressiva concentrada em chamadas para ação, estados e progresso.
- Interações acessíveis: foco visível, alvos confortáveis, redução de animações quando solicitada.
- Estados vazios acolhedores; nada de mascotes ou elementos de marca de terceiros.

## Tom de voz

Frases breves, objetivas e amigáveis. Exemplos:
- “Suas oportunidades, no seu ritmo.”
- “Mais uma candidatura organizada!”
- “Tudo pronto para o próximo passo.”
- “Ainda não há vagas aqui. Adicione sua primeira oportunidade.”

Evitar pressão por sequências diárias, avaliações inventadas, promessas de contratação ou excesso de estímulos.

## Limites

Sem copiar o verde, a fonte proprietária, o mascote ou elementos identificáveis do Duolingo. A referência é a experiência acessível e amigável, não a marca. Priorizar clareza e usabilidade para uma ferramenta de uso diário.

## Implementação

Os tokens estão em `apps/web/src/styles.css`. As cinco colunas continuam operando como antes. O backend e o banco de dados não foram alterados por esta revisão.

## Acessibilidade e personalização

- A aba **Configurações** oferece tema Claro, Escuro e Automático.
- **Automático** acompanha a preferência de cor do sistema operacional em tempo real.
- Os idiomas de interface disponíveis são **Português (Brasil), English e Español**.
- Opções são controles de rádio com interação por mouse e teclado.
- Idioma e tema são salvos apenas no navegador, não no banco de candidaturas.
- Informações digitadas pelo usuário permanecem intactas ao mudar de idioma.
- CSS implementa modo escuro por meio dos tokens `:root[data-theme='dark']`.

A UI mantém identidade própria: **azul piloto** e **menta**, inclusive no modo escuro.

## Logotipo e favicon (azul e branco)

Identidade fornecida e aprovada pelo criador, com monograma **HP** em forma de maleta e seta apontando para cima. A marca usa azul, branco e tipografia arredondada. Os PNGs foram recortados para remover margens vazias e preservar transparência.

- `apps/web/public/hirepilot-wordmark-dark.png`: símbolo azul, texto Hire branco e Pilot azul para superfícies escuras.
- `apps/web/public/hirepilot-wordmark-light.png`: mesma marca com texto Hire azul-marinho, para fundo claro.
- `apps/web/public/hirepilot-icon.png`: símbolo HP em fundo transparente, usado como favicon.

O menu lateral escolhe a versão pelo atributo `data-theme` já configurado pela preferência do usuário; a logo não recebe caixa branca em nenhum tema.
