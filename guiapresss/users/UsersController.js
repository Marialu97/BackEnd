const express = require("express");
const router = express.Router();
const User = require("./Users");
const bcrypt = require('bcryptjs');

// Rota para listar os usuários
router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users });
    }).catch(err => {
        console.log(err);
        res.redirect("/");
    });
});

// Rota para exibir o formulário de criação de usuário
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

// Rota para salvar um novo usuário
router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.create({
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/admin/users"); // Redireciona para a lista de usuários após criar
    }).catch((err) => {
        console.error(err);
        res.redirect("/admin/users/create");
    });
});

module.exports = router;
