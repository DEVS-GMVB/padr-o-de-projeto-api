const { acesso_completo  } = require('../models');
const LoginService = {

    findUser: async (req) =>{
        const { usuario, senha } = req.body;
        const user = await acesso_completo.findOne({

            where: {
                usuario: usuario,
                senha: senha
            },attributes: { exclude: ['senha'] }
        });
      return user
    }
}

module.exports = LoginService;