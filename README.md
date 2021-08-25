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
  
