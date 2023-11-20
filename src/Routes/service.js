const router = require("express").Router();

const ServiceControllerReserve = require("../Controllers/reserveController");
const ServiceControllerUsers = require("../Controllers/userController");
const authGuard = require("../Middleware/authGuard ");
const { getcurrentUser } = require("../Controllers/userController");

// Endpoint para criar uma reserva
router.route("/create/reserve").post((req, res) => ServiceControllerReserve.createReserve(req, res));

// Endpoint para buscar todas as reservas
router.route("/search/reserve").get((req, res) => ServiceControllerReserve.getAllReserve(req, res));

// Endpoint para buscar as reservas de um usuário específico
router.route("/search/reserve/:userId").get((req, res) => ServiceControllerReserve.getUserReserves(req, res));

// Endpoint para excluir uma reserva (somente para administradores e o próprio usuário (que criou a reserva)
router.route("/delete/reserve/:reserveId").delete((req, res) => ServiceControllerReserve.deleteReserve(req, res));
router.route("/update/reserve/:updateId").put((req, res) => ServiceControllerReserve.updateReserveStatus(req, res));

// Endpoint para registrar um novo usuário
router.route("/register").post((req, res) => ServiceControllerUsers.register(req, res));

// Endpoint para realizar login
router.route("/login").post((req, res) => ServiceControllerUsers.login(req, res));

// Endpoint para obter o perfil do usuário atualmente autenticado
router.route("/profile").get(authGuard, getcurrentUser, (req, res) => ServiceControllerUsers.getAll(req, res));

module.exports = router;
