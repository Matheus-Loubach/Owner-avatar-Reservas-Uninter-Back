const { User } = require('../Models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Função para gerar um token JWT com base no ID do usuário
const GenerateToken = (id) => {
    return jwt.sign({ id }, 'KS1486735ANFSAN36454BFGSAF45471PKPEKGPSAGK1454EDGG', {
        expiresIn: "7d"
    });
};

const ServiceControllerUser = {

    // Endpoint POST para registrar um novo usuário
    register: async (req, res) => {
        try {
            const { user, email, password, passwordConf, userType } = req.body;

            // Verificar se o nome de usuário e o e-mail já existem
            const userName = await User.findOne({ user });
            const emailExists = await User.findOne({ email });

            if (userName) {
                return res.status(422).json({ error: "Usuário já existe" });
            }
            if (emailExists) {
                return res.status(422).json({ error: "E-mail já existe" });
            }

            // Validar dados obrigatórios
            if (!user || !email || !password) {
                return res.status(422).json({ error: "Nome, e-mail e senha são obrigatórios" });
            }

            // Verificar se as senhas coincidem
            if (password !== passwordConf) {
                return res.status(422).json({ error: "As senhas não coincidem" });
            }

            // Gerar o hash da senha
            const saltHash = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, saltHash);

            // Criar um novo usuário
            const newUser = {
                user: user,
                email: email,
                password: passwordHash,
                userType: userType
            };

            const createdUser = await User.create(newUser);

            if (!createdUser) {
                return res.status(422).json({ error: ["Houve um erro, tente novamente mais tarde"] });
            }

            // Responder com sucesso
            res.status(201).json({ msg: 'Registro bem-sucedido!' });

        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ msg: 'Erro ao efetuar o cadastro' });
        }
    },

    // Endpoint POST para realizar login
    login: async (req, res) => {
        const { email, password } = req.body;

        // Buscar o usuário pelo e-mail
        let checkUser = await User.findOne({ email });

        if (!checkUser) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        // Comparar a senha fornecida com a senha armazenada no banco de dados
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Senha incorreta" });
        }

        // Retornar informações do usuário com token JWT
        res.status(201).json({
            _id: checkUser._id,
            user: checkUser.user,
            email: checkUser.email,
            userType: checkUser.userType,
            token: GenerateToken(checkUser._id),
        });
    },

    // Endpoint GET para obter o usuário logado atualmente (com validação do token)
    getcurrentUser: async (req, res) => {
        const user = req.user;

        res.status(200).json(user);
    },

    // Endpoint GET para obter todos os usuários
    getAll: async (req, res) => {
        try {
            const users = await User.find();

            res.json(users);

        } catch (error) {
            console.log(`Erro ao obter usuários: ${error}`);
        }
    },
}

module.exports = ServiceControllerUser;
