# Tags
## \<meta>
Define metadados da página (informações sobre os dados da página), como set de characteres, descrição da página, palavras chave etc.

| Atributo | Valor | Descrição |
| -------- | ----- | --------- |
| `charset` | *character_set* | Especifica o set de characteres da página |
| `name` | *application-name*, *author*, *description*, *generator*, *keywords*, *viewport* | Especifica um nome para os metadados |
| `http-equiv` | *content-security-policy*, *content-type*, *default-style*, *refresh* | Dá um header HTTP para a informação/valor do atributo `content` |
| `content` | *text* | Especifica o valor associado com o `http-equiv` ou `name` |

**Keywords**: palavras chaves para o search engine
```html
<meta name="keywords" content="Tutorial, HTML, CSS, JavaScript">
```

**Author**: autor da página
```html
<meta name="author" content="Alec Campos Aoki">
```

**Refresh**: intervalo de tempo entre recarregar a página
```html
<meta name="refresh" content="30"> <!-- Recarrega a pág. a cada 30s -->
```

**Viewport**: área da página visível ao usuário, variando com o dispositivo.
- `width=device-width` define o comprimento da página para ser o mesmo que do dispositivo.
- `initial-sale=1.0` define o zoom inicial da página.
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## \<a>
Hyperlink.

| Atributo | Valor | Descrição |
| -------- | ----- | --------- |
| `download` | *filename* | Especifica que o alvo vai ser baixado quando o link for clicado |
| `href` | *URL* | URL da página alvo do link |
| `hreaflang` | *language-code* | Especifica a língua do documento linkado |
| `referrerpolicy` | *no-referrer*, *origin*, *same-origin*, *unsafe-url*, *etc* | Especifica qual informação de referência mandar com o link |
| `rel` | *alternate*, *author*, *bookmark*, *external*, *help*, *license*, *next*, *nofollow*, *noreferrer*, *noopener*, *prev*, *search*, *tag* | Especifica a relação entre o documento atual e o documento linkado |
| `target` | *_blank*, *_parent*, *_self*, *_top* | Especifica onde abrir o documento linkado |
| `type` | *media_type* | Especifica o tipo de mídia do documento linkado

**Exemplos:**

Usar uma imagem como link:
```html
<a href="https://www.w3schools.com">
    <img border="0" alt="W3Schools" src="logo_w3s.gif" width="100" height="100">
</a>
```

Abrir o link em um novo browser:
```html
<a href="https://www.w3schools.com" target="_blank">Visit W3Schools.com!</a> 
```

Linkar para um e-mail:
```html
<a href="mailto:someone@example.com">Send email</a> 
```

Linkar para uma seção dentro do mesmo site:
```html
<a href="#section2">Go to Section 2</a> 
```

## \<form>
Form para input do usuário. Pode conter um ou mais dos seguintes elementos:
- `<input>`
- `<textarea>`
- `<button>`
- `<select>`
- `<option>`
- `<optgroup>`
- `<fieldset>`
- `<label>`
- `<output>`

 Atributo | Valor | Descrição |
| -------- | ----- | --------- |
| `accept-charset` | *character_set* | Especifica os tipos de caracteres que serão aceitos no form |
| `action` | *URL* | Especifica onde mandar os dados do form quando ele for submetido |
| `autocomplete` | *on*, *off* | Trivial |
| `enctype` | *urlencoded*, *text/plain*, etc. | Especifica como os dados devem ser encodados quando submetidos ao server (apenas para o método post) |
| `method` | *dialog*, *get*, *post* | Especifica o método HTTP a ser usado quando enviando o form |
| `name` | *text* | Nome do form |
| `novalidate` | *novalidate* | Especifica que um form não deve ser validado quuando submetido |
| `target` | *_blank*, *_self*,  *_parent*, *_top* | Especifica onde mostrar a resposta que foi submetida ao form |