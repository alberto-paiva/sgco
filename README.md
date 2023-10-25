# SGCO - Sistema para Gestão de Condomínios.

## Autor: Alberto Paiva.

Projeto apresentado a Disciplina Laboratório de Desenvolvimento de Software, do 6º Período do Curso de Sistemas de Informação.

Instituição: [ESAB - Escola Superior Aberta do Brasil](https://esab.edu.br/).

O projeto é composto por 2 (duas) partes: backend e frontend

_O diretório backend possui os arquivos PHP da API de dados e devem executados em um servidor apache_

_O diretório frontend possui os arquivos da aplicação WEB desenvolvida em REACT e devem executados com o NodeJS para compilação._

Após compilar com o comando informado no ítem 4, pode ser executada em um servidor Apache sem a necessidade do NodeJS estar instalado.

## Getting Started

1. Primeiro, instale as dependencias na pasta frontend:

```bash
pnpm install
```
_PNPM é o gerenciador de pacotes._

2. Altere a opção "outDir" no arquivo **vite.config.ts** apontando para o diretório no seu servidor.


3. Exemplo: 
```js  
outDir: "/wamp64/www/sgco/app"
```


4. Inicie o servidor de desenvolvimento local executando o seguinte comando:

```bash
pnpm build-watch
```

Abra [https://ENDERECO_DO_SERVIDOR]() com seu navegador para ver o resultado.