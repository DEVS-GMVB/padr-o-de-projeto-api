const LoginService = {

    findUser: (req) =>{
        console.log(req.body)
        console.log(process.env.DB_HOST)
    }
}

module.exports = LoginService;