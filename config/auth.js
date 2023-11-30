const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = (passport) => {
    passport.use(
        new localStrategy(
            { usernameField: "email", passwordField: "senha" },
            (email, senha, done) => {
                Usuario.findOne({ email: email })
                    .then((usuario) => {
                        if (!usuario)
                            return done(null, false, {
                                message: "Esta conta não existe",
                            });
                        else {
                            bcrypt.compare(
                                senha,
                                usuario.senha,
                                (err, iguais) => {
                                    if (iguais) return done(null, usuario);
                                    else
                                        return done(null, false, {
                                            message: "Senha incorreta",
                                        });
                                }
                            );
                        }
                    })
                    .catch((err) => {});
            }
        )
    );

    // salvando os dados do usuário na sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
            .then((usuario) => {
                done(null, usuario);
            })
            .catch((err) => {
                console.log(err);
                done(null, false, { message: "Erro deserializeUser" });
            });
    });
};
