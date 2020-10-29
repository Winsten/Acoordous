# Projeto Accordous

# Autor

Winsten de Jesus

# Desenvolvido com

A Quasar Framework app
Laravel 7
SPA PWA APP
MARIADB / MYSQL
DOCKER
LARADOCK

# Inicializando

## Facilidades

Para facilitar já deixei os arquivos .env tanto do laradock, laravel e quasar no projeto

## Iniciando Docker

Para iniciar o projeto é necessário ter o docker instalado com o docker-composer, um bash, acessar a pasta laradock2020 e rodar o comando

```bash
docker-compose up -d nginx mariadb workspace
```

Com isso o sistema docker será criado e dentro de alguns minutos estará funcionado.

## Configuração do hosts

ir no arquivo de hosts do seu sistema e adicionar 127.0.0.1 laravel.test que é a base do caminho que aponta para o projeto em laravel

## Criando a pasta vendor do laravel

Primeiramente você terá que acessar o workspace do ladocker que já vem com tudo instalado e pronto para usar

para acessa-lo basta ir na pasta laradock2020 e rodar o comando

```bash
docker-compose exec workspace bash
```

ou caso esteja no windows.

```bash
winpty docker-compose exec workspace bash
```

com isso voce estará dentro do workspace do laradock e ele automaticamente redirecionará o path para uma pasta anterior ao da pasta do laradock.
Ai é simplesmente acessar a pasta do back e rodar o comando

```bash
composer install
```

Após a execução do comando você deverá também rodar o comando das migrations

```bash
php artisan migrate
```

o sistema já estará disponível para acessa-lo bastando ir no navegador e acessar
laravel.test.

# Acessando o projeto Quasar Front

Na criação da workspace também foi adicionado o npm, yarn, vue e quasar CLI para acessar o frontend basta acessar a pasta front rodar o comando dentro do workspace

```bash
yarn
```

e após a instalação das dependências rodar o comando

```bash
quasar dev
```

Para assim inicar o modo de desenvolvimento do quasar e com isso basta acessar no navegador localhost:8080
