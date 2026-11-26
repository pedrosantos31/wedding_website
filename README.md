# Website do casamento

Site estático (HTML/CSS/JS, sem build) alojado no GitHub Pages, com formulário de RSVP ligado a uma Google Sheet.

## Estrutura

| Ficheiro | Para quê |
|---|---|
| `index.html` | Todo o conteúdo do site (textos, programa, locais, FAQ) |
| `styles.css` | Cores, tipos de letra e layout (as cores estão no topo, em `:root`) |
| `config.js` | Data do casamento, data limite do RSVP, URL do RSVP, nº máximo de pessoas |
| `script.js` | Menu móvel, contagem decrescente, envio do formulário |
| `apps-script/Code.gs` | Script a colar na Google Sheet que recebe as respostas |

## Ver localmente

Abre `index.html` no browser, ou corre `python -m http.server 8000` nesta pasta e vai a http://localhost:8000.

## RSVP → Google Sheet

1. Cria uma Google Sheet nova (ex.: "RSVP Casamento").
2. **Extensões → Apps Script**. Apaga o que lá está, cola o conteúdo de `apps-script/Code.gs` e guarda.
   - Para receber um email a cada resposta, mete o teu email em `NOTIFY_EMAIL`.
3. **Implementar → Nova implementação** → ícone da roda → **Aplicação Web**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
4. Autoriza as permissões que o Google pedir (aparece um aviso de "app não verificada": *Avançadas → Aceder*; o script é teu).
5. Copia o **URL da aplicação Web** (acaba em `/exec`) para `rsvpEndpoint` em `config.js`.
6. Testa: envia uma resposta no site e confirma que aparece uma linha na folha "RSVP".

> Se alterares o `Code.gs` depois, faz **Implementar → Gerir implementações → Editar → Nova versão** para o URL continuar o mesmo.

## Publicar no GitHub Pages

1. O repositório tem de ser **público** (ou ter GitHub Pro).
2. GitHub → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. O site fica em `https://<utilizador>.github.io/wedding_website/`.

### Domínio próprio

1. Em **Settings → Pages → Custom domain**, escreve o domínio (ex.: `www.nomes.pt`). Isto cria um ficheiro `CNAME` no repo.
2. No registador do domínio, cria os registos DNS:
   - `www` → **CNAME** → `<utilizador>.github.io`
   - Raiz (`@`) → **A** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Quando o DNS propagar, ativa **Enforce HTTPS**.

## Privacidade

O repositório é público: **não** ponhas aqui listas de convidados nem dados pessoais. As respostas do RSVP ficam só na tua Google Sheet. A página tem `noindex` para não aparecer nas pesquisas do Google.
