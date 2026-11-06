# Comercial Ferraz

Site da Comercial Ferraz (troca de óleo, peças e mecânica, Agudos/SP) e página da bio do Instagram.

- `public/index.html`: site (vai no campo "site" da ficha do Google Maps)
- `public/links.html`: página da bio do Instagram (endereço `/links`)
- `public/privacidade.html`: política de privacidade (endereço `/privacidade`)
- `public/404.html`: página de endereço inexistente

HTML, CSS e JavaScript puros, sem etapa de build. Hospedado na Vercel: publica só a pasta `public/`, com cabeçalhos de segurança (sem script ou estilo embutido) e endereços curtos (ver `vercel.json`).

## Como funciona o orçamento

As placas de serviço e de veículo montam a mensagem do WhatsApp na hora, e o painel preto mostra exatamente o texto que vai ser enviado. Nada sai do navegador até a pessoa tocar no botão. A mensagem diz de onde a pessoa veio ("site" ou "Instagram"). Número do WhatsApp: `pedido.js` e os links `wa.me` das páginas.

O "Aberto agora" é calculado no horário de Brasília (`pagina.js`). Feriados não entram: o site pede para confirmar pelo WhatsApp.

## Publicar

1. Criar um repositório com o conteúdo desta pasta (`site/`) e enviar ao GitHub.
2. Na Vercel: **Add New → Project → Import** o repositório e clicar em **Deploy**. Não precisa mudar nada; a configuração vem do `vercel.json`.
3. Trocar o endereço provisório `https://comercialferraz.vercel.app` pelo endereço final em todos os arquivos (aparece no `canonical`, nas metatags de compartilhamento, nos dados estruturados, no `robots.txt` e no `sitemap.xml`):
   `grep -rl "comercialferraz.vercel.app" public | xargs sed -i '' 's#https://comercialferraz.vercel.app#https://SEU-ENDERECO#g'`
4. Na ficha do Google Maps (Perfil da Empresa), trocar o campo **Site** pelo endereço novo.
5. Na bio do Instagram @comercialferraz_, colocar o endereço novo terminado em `/links`.

Cada envio ao ramo `main` atualiza o site.

## Rodar no computador

`python3 servir.py` e abrir http://localhost:5180 (e http://localhost:5180/links). O servidor aplica os mesmos cabeçalhos de segurança da Vercel e entende os endereços curtos. Para ver no celular, usar o IP do computador na rede, na mesma porta.

## Arquivos

- `public/style.css`: todo o visual. Sistema de placas: amarela = atenção e ação, preta = indicação e contato, branca = informação, vermelha = a placa da loja.
- `public/fonts/`: Overpass (licença livre, ver `LICENCA.txt`).
- `public/img/icones.svg`: pictogramas de serviço e de veículo desenhados para o site, mais os ícones de interface.
- `public/img/`: foto do Fusca (otimizada em dois tamanhos), recortes da arte de divulgação (fachada, galpão, logo) e a imagem de compartilhamento (`og.jpg`).
