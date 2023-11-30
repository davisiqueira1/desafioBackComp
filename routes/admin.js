const express = require("express");
const mongoose = require("mongoose");
require("../models/Genero"); // pra ele registrar o model
const Genero = mongoose.model("generos");
require("../models/Livro"); // pra ele registrar o model
const Livro = mongoose.model("livros");
require("../models/Usuario"); // pra ele registrar o model
const Usuario = mongoose.model("usuarios");
const { ehAdmin } = require("../helpers/ehAdmin");
const router = express.Router();

const validarCamposGenero = (nome, descricao) => {
    let erros = [];
    if (!nome || typeof nome == undefined || nome == null) {
        erros.push({ texto: "Nome inválido" });
    }

    if (!descricao || typeof descricao == undefined || descricao == null) {
        erros.push({ texto: "Descrição inválida" });
    }
    return erros;
};

router.get("/", ehAdmin, (req, res) => {
    res.render("admin/index");
});

router.get("/generos", ehAdmin, (req, res) => {
    Genero.find()
        .sort({ data: "desc" })
        .then((generos) => {
            res.render("admin/generos", {
                generos: generos.map((genero) => genero.toJSON()),
            });
        })
        .catch((err) => {
            req.flash("errorMessage", "Houve um erro ao listar os generos");
            res.redirect("/admin");
        });
});

router.post("/generos/novo", ehAdmin, (req, res) => {
    let erros = validarCamposGenero(req.body.nome, req.body.descricao);
    if (erros.length > 0) res.render("admin/addgeneros", { erros: erros });
    else {
        const novoGenero = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            data: Date.now(), // o default tava pegando a data do primeiro post e colocando em todos
        };
        new Genero(novoGenero)
            .save()
            .then(() => {
                req.flash("successMessage", "Gênero criado com successo!");
                res.redirect("/admin/generos");
            })
            .catch((err) => {
                req.flash("errorMessage", "Houve um erro ao salvar o genero.");
                res.redirect("/admin");
            });
    }
});

router.get("/generos/add", ehAdmin, (req, res) => {
    res.render("admin/addgeneros");
});

router.get("/generos/edit/:id", ehAdmin, (req, res) => {
    Genero.findOne({ _id: req.params.id })
        .then((genero) => {
            res.render("admin/editgeneros", {
                genero: genero.toJSON(),
            });
        })
        .catch((err) => {
            console.log(err);
            req.flash("errorMessage", "Este genero não existe.");
            res.redirect("/admin/generos");
        });
});

router.post("/generos/edit", ehAdmin, (req, res) => {
    let erros = validarCamposGenero(req.body.nome, req.body.descricao);

    if (erros.length > 0) res.render("admin/editgeneros", { erros: erros });
    else {
        Genero.findOne({ _id: req.body.id })
            .then((genero) => {
                genero.nome = req.body.nome;
                genero.descricao = req.body.descricao;
                genero
                    .save()
                    .then(() => {
                        req.flash(
                            "successMessage",
                            "O genero foi editado com successo!"
                        );
                    })
                    .catch((err) => {
                        req.flash(
                            "errorMessage",
                            "Houve um erro ao salvar a edição do genero."
                        );
                    });
            })
            .catch((err) => {
                req.flash("errorMessage", "Houve um erro ao editar o genero.");
            })
            .finally(() => res.redirect("/admin/generos"));
    }
});

router.post("/generos/deletar", ehAdmin, (req, res) => {
    Genero.findOneAndRemove({ _id: req.body.id })
        .then(() => {
            req.flash("successMessage", "O genero foi deletado com successo");
        })
        .catch((err) => {
            req.flash("errorMessage", "Não foi possível deletar o genero");
        })
        .finally(() => res.redirect("/admin/generos"));
});

router.get("/livros", ehAdmin, (req, res) => {
    Livro.find()
        .populate("genero")
        .sort({ data: "desc" })
        .then((livros) => {
            res.render("admin/livros", {
                livros: livros.map((livro) => livro.toJSON()),
            });
        })
        .catch((err) => {
            req.flash("errorMessage", "Houve um erro ao listar os livros");
            res.redirect("/admin");
        });
});

router.get("/livros/add", ehAdmin, (req, res) => {
    Genero.find()
        .then((generos) => {
            res.render("admin/addlivros", {
                generos: generos.map((genero) => genero.toJSON()),
            });
        })
        .catch((err) => {
            req.flash(
                "errorMessage",
                "Houve um erro ao carregar o formulário."
            );
            res.redirect("/admin");
        });
});

router.post("/livros/novo", ehAdmin, (req, res) => {
    let erros = [];

    if (req.body.genero == "0")
        erros.push({ texto: "Gênero inválido. Registre um gênero." });

    if (erros.length > 0) res.render("admin/addlivros", { erros: erros });
    else {
        const novoLivro = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            paginas: req.body.paginas,
            autor: req.body.autor,
            editora: req.body.editora,
            genero: req.body.genero,
            data: Date.now(), // o default tava pegando a data do primeiro post e colocando em todos
        };
        console.log(novoLivro);

        new Livro(novoLivro)
            .save()
            .then(() => {
                req.flash("successMessage", "Livro criado com sucesso!");
            })
            .catch((err) => {
                console.log(err);
                req.flash(
                    "errorMessage",
                    "Houve um erro durante o registro do livro."
                );
            })
            .finally(() => res.redirect("/admin/livros"));
    }
});

router.get("/livros/edit/:id", ehAdmin, (req, res) => {
    Livro.findOne({ _id: req.params.id })
        .then((livro) => {
            Genero.find()
                .then((generos) => {
                    res.render("admin/editlivros", {
                        livro: livro.toJSON(),
                        generos: generos.map((genero) => genero.toJSON()),
                    });
                })
                .catch((err) => {
                    req.flash(
                        "errorMessage",
                        "Houve um erro ao listar os generos"
                    );
                    res.redirect("/admin/livros");
                });
        })
        .catch((err) => {
            req.flash(
                "errorMessage",
                "Houve um erro ao carregar o formulário de edição"
            );
            res.redirect("/admin/livros");
        });
});

router.post("/livros/edit", ehAdmin, (req, res) => {
    Livro.findOne({ _id: req.body.id })
        .then((livro) => {
            livro.titulo = req.body.titulo;
            livro.descricao = req.body.descricao;
            livro.paginas = req.body.paginas;
            livro.autor = req.body.autor;
            livro.editora = req.body.editora;
            livro.genero = req.body.genero;
            livro
                .save()
                .then(() => {
                    req.flash("successMessage", "Livro editado com sucesso");
                })
                .catch((err) => {
                    req.flash("errorMessage", "Erro interno");
                });
        })
        .catch((err) => {
            req.flash("errorMessage", "Houve um erro ao salvar a edição");
        })
        .finally(() => res.redirect("/admin/livros"));
});

router.post("/livros/deletar", ehAdmin, (req, res) => {
    Livro.findOneAndRemove({ _id: req.body.id })
        .then(() => {
            req.flash("successMessage", "O livro foi deletado com successo");
        })
        .catch((err) => {
            req.flash("errorMessage", "Não foi possível deletar o livro");
        })
        .finally(() => res.redirect("/admin/livros"));
});

router.get("/usuarios", ehAdmin, (req, res) => {
    Usuario.find()
        .then((usuarios) => {
            res.render("admin/usuarios", {
                usuarios: usuarios.map((usuario) => usuario.toJSON()),
            });
        })
        .catch((err) => {
            req.flash("errorMessage", "Erro interno");
            res.redirect("/admin");
        });
});

router.get("/usuarios/edit/:id", (req, res) => {
    Usuario.findOne({ _id: req.params.id })
        .then((usuario) => {
            res.render("admin/editusuarios", {
                usuario: usuario.toJSON(),
            });
        })
        .catch((err) => {
            req.flash(
                "errorMessage",
                "Houve um erro ao carregar o formulário de edição"
            );
            res.redirect("/admin/usuarios");
        });
});

router.post("/usuarios/edit", (req, res) => {
    Usuario.findOne({ _id: req.body.id })
        .then((usuario) => {
            usuario.nome = req.body.nome;
            usuario.email = req.body.email;
            usuario.ehAdmin = req.body.administrador;
            usuario
                .save()
                .then(() => {
                    req.flash("successMessage", "Usuário editado com sucesso");
                })
                .catch((err) => {
                    req.flash("errorMessage", "Erro interno");
                });
        })
        .catch((err) => {
            console.log(err);
            req.flash("errorMessage", "Houve um erro ao salvar a edição");
        })
        .finally(() => res.redirect("/admin/usuarios"));
});

router.post("/usuarios/deletar", (req, res) => {
    Usuario.findOneAndRemove({ _id: req.body.id })
        .then(() => {
            req.flash("successMessage", "O usuário foi deletado com successo");
        })
        .catch((err) => {
            req.flash("errorMessage", "Não foi possível deletar o usuário");
        })
        .finally(() => res.redirect("/admin/usuarios"));
});

module.exports = router;
