const { Service: ServiceReserve } = require('../Models/reserveModel');
const { User } = require('../Models/userModel');

const ServiceControllerReserve = {

    // Endpoint POST para criar uma reserva
    createReserve: async (req, res) => {
        try {
            // Extrair dados da requisição
            const { title, description, status, idUser } = req.body;

            // Validar se o usuário existe
            const userData = await User.findById(idUser).select("-password");

            if (!userData) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
            }

            // Estrutura da reserva com informações do usuário
            const reserveStructure = {
                title,
                description,
                status,
                idUser: idUser,
                user: userData.user,
                userType: userData.userType,
            };

            // Criar a reserva usando o serviço
            const response = await ServiceReserve.create(reserveStructure);

            // Responder com sucesso
            res.status(201).json({ msg: 'Reserva efetuada com sucesso!' });
        } catch (error) {
            // Responder em caso de erro
            console.error(error);
            res.status(500).json({ msg: 'Erro ao criar a reserva', error: error.message });
        }
    },

    // Endpoint PUT para atualizar o status de uma reserva
    updateReserveStatus: async (req, res) => {
        try {
            // Extrair o ID da reserva e o novo status da requisição
            const reserveID = req.params.updateId;
            const { status } = req.body;

            // Validar se a reserva existe
            const existingReserve = await ServiceReserve.findById(reserveID);

            if (!existingReserve) {
                return res.status(404).json({ msg: 'Reserva não encontrada' });
            }

            // Atualizar o status da reserva
            existingReserve.status = status;
            await existingReserve.save();

            // Responder com sucesso
            res.status(200).json({ msg: `Status da Reserva atualizado para ${status}` });
        } catch (error) {
            // Log do erro
            console.error('Erro ao atualizar o status da reserva:', error);

            // Responder com erro
            res.status(500).json({ msg: 'Erro ao atualizar o status da reserva', error: error.message });
        }
    },

    // Endpoint GET para buscar reservas de um usuário específico
    getUserReserves: async (req, res) => {
        try {
            // Extrair o ID do usuário da requisição
            const userId = req.params.userId;

            // Validar se o usuário existe
            const userData = await User.findById(userId);

            if (!userData) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
            }

            // Buscar as reservas do usuário
            const userReserves = await ServiceReserve.find({ 'idUser': userId }).sort({ createdAt: -1 }).exec();

            res.json(userReserves);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar as reservas do usuário', error: error.message });
        }
    },

    // Endpoint GET para buscar todas as reservas
    getAllReserve: async (req, res) => {
        try {
            const services = await ServiceReserve.find().sort({ createdAt: -1 }).exec();

            res.json(services);
        } catch (error) {
            res.status(500).json({ msg: 'Erro ao buscar a reserva' });
        }
    },

    // Endpoint DELETE para excluir uma reserva
    deleteReserve: async (req, res) => {
        try {
            // Extrair o ID da reserva da requisição
            const reserveID = req.params.reserveId;

            // Validar se a reserva existe
            const deletedReserve = await ServiceReserve.findByIdAndDelete(reserveID);

            if (!deletedReserve) {
                return res.status(404).json({ msg: 'Reserva não encontrada' });
            }

            // Log da exclusão bem-sucedida
            console.log(`Reserva ${reserveID} excluída com sucesso`);

            // Responder com sucesso
            res.status(200).json({ msg: 'Reserva excluída com sucesso' });
        } catch (error) {
            // Log do erro
            console.error('Erro ao excluir a reserva:', error);

            // Responder com erro
            res.status(500).json({ msg: 'Erro ao excluir a reserva', error: error.message });
        }
    },
}

module.exports = ServiceControllerReserve;
