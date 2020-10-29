# Projeto Accordous

# Desenvolvido com 
A Quasar Framework app
Laravel 7
SPA PWA APP
MARIADB / MYSQL
DOCKER
LARADOCK 


## Iniciando
Para iniciar o projeto é necessário ter o docker instalado com o docker-composer, acessar a pasta laradock2020 e rodar o comando
```bash
docker-compose up -d nginx mariadb workspace
```
Com isso o sistema docker será criado e dentro de alguns minutos estará funcionado.

Após isso ir no arquivo de hosts do seu sistema e adicionar 127.0.0.1 laravel.test que é a base do caminho que aponta para o projeto em laravel

Ao fazer isso o sistema está quase pronto para ser executado no navegador restando apenas migrar a base de dados.

Para facilitar já deixei os arquivos .env no projeto

### Acessando o composer do laravel
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
