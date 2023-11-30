const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const validarCampos = (nome, email, senha, senha2) => {
    const campo_erro = [
        { campo: nome, msg: "Nome inválido" },
        { campo: email, msg: "Email invalido" },
        { campo: senha, msg: "Senha inválida" },
    ];
    let erros = [];
    campo_erro.forEach(({ campo, msg }) => {
        if (!campo || typeof campo == undefined || campo == null)
            erros.push({ texto: msg });
    });

    if (senha.length < 4) erros.push({ texto: "Senha muito curta" });
    if (senha != senha2) erros.push({ texto: "As senhas são diferentes" });

    return erros;
};

router.get("/registro", (req, res) => {
    res.render("usuario/registro");
});

router.post("/registro", (req, res) => {
    let erros = validarCampos(
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.body.senha2
    );
    if (erros.length > 0) res.render("usuario/registro", { erros: erros });
    else {
        Usuario.findOne({ email: req.body.email })
            .then((usuario) => {
                if (usuario) {
                    req.flash(
                        "errorMessage",
                        "Já existe uma conta cadastrada com esse email"
                    );
                    res.redirect("/usuario/registro");
                } else {
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                        data: Date.now(),
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                            if (err) {
                                req.flash(
                                    "errorMessage",
                                    "Houve um erro durante o registro do usuário"
                                );
                                res.redirect("/");
                            }
                            novoUsuario.senha = hash;
                            novoUsuario
                                .save()
                                .then(() => {
                                    req.flash(
                                        "successMessage",
                                        "Usuário criado com sucesso"
                                    );
                                    res.redirect("/");
                                })
                                .catch((err) => {
                                    console.log(err);
                                    req.flash(
                                        "errorMessage",
                                        "Houve um erro ao criar o usuário"
                                    );
                                    res.redirect("/");
                                });
                        });
                    });
                }
            })
            .catch((err) => {
                req.flash("errorMessage", "Houve um erro interno");
                res.redirect("/");
            });
    }
});

router.get("/login", (req, res) => {
    res.render("usuario/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true,
    })(req, res, next);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("successMessage", "Usuário deslogado com sucesso");
        res.redirect("/");
    });
});

module.exports = router;
