# Vehicle Tracking System

Este projeto é um sistema de rastreamento de veículos desenvolvido em **NestJS** com **TypeScript**, utilizando **PostgreSQL** como banco de dados e **RabbitMQ** para mensageria e eventos. O objetivo é monitorar e gerenciar frotas de veículos em tempo real.

## Índice

- [Descrição](#descrição)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Projeto](#configuração-do-projeto)
- [Executando com Docker](#executando-com-docker)
- [Comandos Úteis](#comandos-úteis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Descrição

O Vehicle Tracking System permite o cadastro, monitoramento e rastreamento de veículos, fornecendo informações em tempo real sobre localização, status e histórico de trajetos.

## Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- RabbitMQ
- Docker
- Docker Compose
- pnpm

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- [pnpm](https://pnpm.io/installation) instalado

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/lucaslgm/vehicle-tracking-system
   cd vehicle-tracking-system
   ```

2. **Crie o arquivo `.env`:**

   É necessário criar um arquivo `.env` na raiz do projeto para definir as variáveis de ambiente utilizadas pela aplicação.
   Em seguida, edite o arquivo `.env` e configure as seguintes variáveis (substitua os valores de usuário, senha e tokens conforme sua necessidade e segurança):

   ```
   # URL de conexão com o banco de dados PostgreSQL para a API
   DATABASE_URL_API="postgresql://USUARIO:SENHA@localhost:5432/vehicle_tracking?schema=gateway"

   # URL de conexão com o banco de dados PostgreSQL para o simulador
   DATABASE_URL_SIMULATOR="postgresql://USUARIO:SENHA@localhost:5432/vehicle_tracking?schema=simulator"

   # URL da API do simulador
   SIMULATOR_API_URL="http://localhost:3001/simulator"

   # URL de conexão com o RabbitMQ
   RABBITMQ_URL="amqp://guest:guest@localhost:5672/"

   # Token de autenticação da API
   API_TOKEN="SEU_TOKEN_AQUI" (ex: EFQfjjDquUsD0FIKYyqaFTPCt7238q9mL8OGyZ2DF4FCJF5sDIKZIHEtZZg3pC15)
   ```

   > **Atenção:** Nunca compartilhe seus dados sensíveis (usuário, senha, tokens) em repositórios públicos.

3. **Verifique o `docker-compose.yml`:**
   Exemplo de configuração:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - '3000:3000'
       env_file:
         - .env
       depends_on:
         - db
         - rabbitmq
     db:
       image: postgres:15
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: sua_senha
         POSTGRES_DB: vehicle_tracking
       ports:
         - '5432:5432'
       volumes:
         - pgdata:/var/lib/postgresql/data
     rabbitmq:
       image: rabbitmq:3-management
       ports:
         - '5672:5672'
         - '15672:15672'
   volumes:
     pgdata:
   ```

## Executando com Docker

1. **Build e start dos containers:**

   ```bash
   docker-compose up --build
   ```

2. **Execute as migrations do Prisma para criar as tabelas no banco de dados:**

   Após os containers do PostgreSQL estarem em execução, rode os comandos abaixo para aplicar as migrations:

   ```bash
   # Para o banco da API
   pnpm run db:migrate:api

   # Para o banco do simulador
   pnpm run db:migrate:simulator
   ```

   Se precisar gerar os clientes Prisma após alterações no schema, utilize:

   ```bash
   pnpm run db:generate:api
   pnpm run db:generate:simulator
   ```

## Rodando a Aplicação

Após executar as etapas de configuração, siga os passos abaixo para rodar a aplicação em ambiente de desenvolvimento:

1. **Suba os containers do banco de dados e RabbitMQ:**

   ```bash
   docker-compose up
   ```

2. **Execute as migrations do Prisma para criar as tabelas no banco de dados:**

   ```bash
   pnpm run db:migrate:api
   pnpm run db:migrate:simulator
   ```

3. **Instale as dependências do projeto:**

   ```bash
   pnpm install
   ```

4. **Inicie a API e o simulador em modo desenvolvimento:**
   - Para rodar apenas a API:
     ```bash
     pnpm run dev:api
     ```
   - Para rodar apenas o simulador:
     ```bash
     pnpm run dev:simulator
     ```
   - Para rodar ambos simultaneamente:
     ```bash
     pnpm run dev
     ```

5. **Acesse a documentação da API:**
   - [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

3. **Parar os containers:**
   ```bash
   docker-compose down
   ```

## Comandos Úteis

- Instalar dependências (local): `pnpm install`
- Rodar testes: `pnpm test`
- Acompanhar logs: `docker-compose logs -f app`

## Estrutura de Pastas

```
vehicle-tracking-system/
├── apps/
│   └── api/
│       ├── node_modules/
│       ├── src/
│       │   ├── core/
│       │   ├── vehicles/
│       │   │   ├── repositories/
│       │   │   ├── services/
│       │   │   ├── shared/
│       │   │   └── use-cases/
│       │   │       ├── commands/
│       │   │       ├── events/
│       │   │       │   ├── consumers/
│       │   │       │   └── publishers/
│       │   │       └── queries/
│       │   │           ├── get-all-vehicles/
│       │   │           ├── get-vehicle-by-id/
│       │   │           └── get-vehicle-history/
│       │   ├── vehicles.controller.ts
│       │   ├── vehicles.module.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       ├── package.json
│       ├── tsconfig.app.json
│       └── tsconfig.json
├── simulator/
├── libs/
│   └── common/
│       ├── node_modules/
│       ├── src/
│       ├── package.json
│       └── tsconfig.lib.json
├── db-api/
```

## Contribuição

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas alterações: `git commit -m 'feat: nova feature'`
4. Push para o branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
