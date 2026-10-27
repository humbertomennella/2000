# WEB ZONE 2000

Uma experiência nostálgica e interativa sobre a internet, a cultura pop, a tecnologia e os acontecimentos dos anos 1990 e 2000.

## Estrutura

- `index.html`: estrutura e conteúdo da página.
- `styles.css`: visual inspirado em homepages pessoais, Windows 9x, banners e portais da web antiga.
- `app.js`: filtros históricos, janelas flutuantes, navegador simulado, mensageiro fictício, guestbook local, perfil, webring e jogo de reflexos.
- `assets/favicon.svg`: ícone do site.

## Executar

Abra `index.html` no navegador ou publique o repositório com GitHub Pages:

1. Acesse **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)).
4. Salve e aguarde a publicação.

## Dados e privacidade

O projeto não precisa de banco de dados para funcionar neste estágio. Preferências, contador local, recorde do minigame e mensagens do guestbook são armazenados no `localStorage` do navegador de cada visitante. Isso significa que não são compartilhados entre pessoas nem sincronizados entre dispositivos.

O mensageiro é uma simulação com respostas fictícias, não um serviço de chat real. Para transformar guestbook e chat em recursos públicos multiusuário, seria necessário adicionar backend e autenticação. Supabase é uma opção futura, mas não é necessário expor credenciais nem adicionar infraestrutura antes de existir essa necessidade.

## Conteúdo histórico

Os registros são resumos editoriais e incluem links para fontes ou instituições de referência. Antes de ampliar o arquivo, confira a data, a precisão do resumo e a qualidade da fonte. Imagens externas podem depender da disponibilidade de terceiros.

## Direção visual

A intenção não é transformar tudo em neon synthwave moderno. A estética usa janelas cinza em relevo, barras azuis, texto compacto, cores primárias, marquee, banners, caixas, pixel art e elementos de homepage pessoal entre 1997 e 2005, com adaptações responsivas para telas atuais.

## Próximas melhorias sugeridas

1. Criar páginas pessoais internas com temas independentes.
2. Ampliar o arquivo histórico do Brasil com fontes verificáveis.
3. Adicionar páginas por ano e páginas de cultura (música, TV, cinema, games e tecnologia).
4. Implementar busca geral e favoritos persistentes.
5. Se houver necessidade real de colaboração entre visitantes, desenhar schema e políticas de acesso do Supabase antes de conectar um banco.
