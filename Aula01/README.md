# Conceitos
## HTTP
Protocolo da camada de aplicação.

- Requisição (REQUEST):
    ```
    <Verbo> + <URI> + <Versão HTTP> + <Cabeçalho/header> + <Corpo/body>
    ```

- Resposta (RESPONSE):
    ```
    <Versão HTTP> + <Código resposta> + <Cabeçalho/header> + <Corpo/body>
    ```
    - Range 200: Success;
    - Range 400: Not found;
    - Range 500: Server error.

## URI e URL
- **URI** (*Uniform Resource Identifier*): sequência de caracteres que identifica unicamente um recurso na internet;
- **URL** (*Uniform Resource Locator*): tipo de URI que inclui informações sobre como acessar um recurso, indicando o protocolo de comunicação, o endereço do recurso etc.;
- **URN** (*Uniform Resource Name*): usado apenas para identifica unicamente um recurso (ex: DOI).

**Todas URLs são URIs, mas nem todas URIs são URLs**

## Web
**OBS**: Internet é a rede física. Web é um sistema que permite páginas HTML e outros recursos serem acessados pela internet por meio do HTTP.

A web é fortemente baseada no sistema cliente-servidor, e um servidor web pode se refererir a um hardware ou software que atende as requisições do cliente.

Navegadores são softwares que permitem a renderização da Web.