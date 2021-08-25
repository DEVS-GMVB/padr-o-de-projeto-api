const LoginService = {
    
    create:(req)=> {
        let username = 'marcos';
        let password = '123456';

        console.log(req)
        
    },

    read: (req) =>{
        console.log(req.body)
    },

    update: (req) =>{

    },

    delete: (req) =>{

    }
}

module.exports = LoginService;