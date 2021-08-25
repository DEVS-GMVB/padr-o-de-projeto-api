# Padrão de projeto api
Guia de projeto para api´s node.js , utilizando principios de solid e clean architecture

## Motivação:
No node temos muita liberdade para construir nossa API REST da forma que desejarmos, quem está começando não sabe ao certo como organizar,
Talvez em projetos pequenos você não perceba os problemas que isso pode te causar, projetos maiores onde visa escalonar, provavelmente terá problemas com essa organização para manter o código com um alto acoplamento trazendo falta de reutilização de código, falta de estabilidade.


## Estrutura de pastas

```bash
src
│   app.js          # Classe app
│   server.js       # Server para iniciar o app
└───api             
  └───controllers   # Funções da controllers do express route
  └───models        # Modelos do banco de dados
  └───services      # Regras de negócio
  └───subscribers   # Eventos async 
  └───repositories* # Query builders 
└───config          # Configuração das variaveis de ambiente
└───jobs            # Tarefas de rotinas
└───loaders         # Modulos para utilizado no app
└───utils           # Trechos de código pequeno
└───helpers         # Trechos de arquitetura de código
└───routes          # Definição de rotas express
└───types           # Tipagem (d.ts) para Typescript

```
##  Solid:
“Uma classe deve ter um, e apenas um, motivo para ser modificada”
![solid](https://user-images.githubusercontent.com/32857539/130803413-4faffed5-7329-41be-ab1d-a86e6130ffcc.png)

## Controllers
O controle deve se preocupar em aceitar a solicitação, repassar para o serviço de domínio correto processe a solicitação e entregue a resposta ao cliente.

``` bash

route.post('/client', async (req, res, next) => {
  try {
    const response = await ClientService.create(req.body);
    return res.status(201).json(response);
  } catch (e) {
    return next(e);
  }
});
```

 ## Services:
Essa camada é um design pattern que ajuda a abstrair suas regras de negócio, deixando sua controller mais limpa e com a responsabilidade única.
 ``` bash
 async create(client) { 
  validators.client(client);

  const clientRecord = await ClientModel.create(client);  
  delete clientRecord.password;  
  
  const partyRecord = await PartyService.create(clientRecord);

  return { client: clientRecord, party: partyRecord };  
}
 ```
 
 ## Repositories*(opcional)
Ter querys sql no código de uma service isso torna um código grande e ilegível, por isso atribuimos aos repositories o trabalho de ser uma camada de acesso e interação com as entidades do banco de dados.

## Subscribers (Pub/Sub)
Quando se tem uma aplicação onde ela utiliza serviços de terceiros e geralmente fazemos uso na camada de controller junto com a regras de negócio com o tempo a aplicação crescendo é muito provável que iremos acrescentar mais linhas de códigos de serviços externos.
Abordagem de utilizar um serviço de terceiro de forma imperativo não é a melhor opção para esse caso, por isso é bom trabalhar com eventos sendo emitidos para cada subscriber depois que uma ação for executada na camada da service.

## Jobs
Essa camada é criada para armazenar tarefas agendadas que precisam ser feitas automaticamente em um certo intervalo de tempo. Como nossa regra de negócios está centralizada em um serviço isso facilita a utilização em um cron.
Devido a forma que o node funciona é melhor evitar a utilização de formas primitivas para agendar uma tarefa e com isso você ganha um controle melhor dos retornos da ação executada.

## Models
Determina a estrutura lógica que representa uma entidade do banco de dados e da forma na qual os dados podem ser manipulados e organizados.
```bash
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10)
          }
        }
      }
    }
  )

  User.prototype.checkPassword = function (pass) {
    return bcrypt.compare(pass, this.password)
  }

  User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, env.appSecret)
  }

  return User
}
```
## Database
Onde organizamos nossas migrations para que a equipe tenha o controle do versionamento do banco de dados e dos seeders para popular nosso banco com dados inserido pelo desenvolvedor.

## Utils
Trechos de código pequeno que são utilizado por mais de uma classe. Funções que são utilizadas para auxiliar na construção de um código maior e podendo ser utilizado em qualquer parte das camadas aplicação, por exemplo um helper pode utilizar mais de um util para construir um código mais completo para uma finalidade especifica.

```bash
const moment = require('moment');

module.exports = (date) => (date === undefined && !moment(date, moment.ISO_8601, true).isValid());
```
## Helpers
Trechos de arquitetura de código que contém apresentações lógicas que podem ser compartilhadas entre as camadas da aplicação contendo várias funções englobada para servir de bootstrap a outros componentes.

```bash
const generateNumber = (max) => {
  let number = '';
  for (let index = 0; index < max; index++) {
    number = `${number}${faker.random.number(9)}`;
  }
  return number;
};

const minOne = (max) => {
  const number = faker.random.number(max);
  return number > 0 ? number : 1;
};

// CREATE USER
factory.define('Usuario', Usuario, {
  ...
});

// CREATE CLIENT
factory.define('Cliente', Cliente, {
  ...
});

// CREATE PARTY
factory.define('Party', Party, {
 ...
});

// CREATE LOCAL
factory.define('Local', Local, {
  ...
});
```

## Constants
A utilização das constantes strings são muito importantes para você poder centralizar uma palavra de retorno de error, sucesso, status HTTP, nome de uma entidade que se repete por várias partes do código pois na hora quando houver uma mudança de valor naquela constantes todas as partes que utilizarem vão ser alteradas sem a necessidade de ficar procurando em cada arquivo pelo projeto.
```bash
module.exports = {
  userSuccess: 'Usuário foi criado com sucesso',
  userError: 'Usuário não pode ser criado',
  userNotFound: 'Usuário não encontrado',
  userAlreadyExist: 'Usuário já existe na nossa base de dados'
}
```

## Config
É onde vamos centralizar todas as nossas variáveis de ambiente e outras configurações que utilizaremos pela aplicação, como: acesso a banco de dados, chave secreta, email
```bash
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

module.exports = {
database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  }
}
```

## Rotas
Separamos as rotas das controllers, pois uma rota pode ter vários tipo de requisições (post, get, put, delete, option) e assim mantemos o código limpo.

```bash
const routes = require('express').Router()

const UserController = require('../app/controllers/UserController')
const AuthController = require('../app/controllers/AuthController')

// Authentication routes
routes.post('/signin', AuthController.store)

// User routes
routes.post('/', UserController.store)
routes.put('/:id', UserController.update)
routes.get('/:id', UserController.get)
routes.delete('/:id', UserController.destroy)

module.exports = routes
```
A idéia e que possoamos melhorar nossos, quesitos de escalabilidade e sustentabilidade do código e alinhando a agilidade com a qualidade na entrega dos resultados.

