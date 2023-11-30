const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const usuario = require("./routes/usuario");
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Livro");
const Livro = mongoose.model("livros");
require("./models/Genero");
const Genero = mongoose.model("generos");
const passport = require("passport");
require("./config/auth")(passport);
const app = express();

// Configurações
// Sessão
app.use(
    session({
        secret: Math.random().toString(),
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongoose
mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://127.0.0.1/biblioteca")
    .then(() => {
        console.log("mongodb conectado");
    })
    .catch((err) => {
        console.log(`erro: ${err}`);
    });

// Public
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.get("/", (req, res) => {
    Livro.find()
        .populate("genero")
        .sort({ data: "desc" })
        .then((livros) => {
            res.render("index", {
                livros: livros.map((livro) => livro.toJSON()),
            });
        })
        .catch((err) => {
            console.log(err);
            req.flash("errorMessage", "Houve um erro interno");
            res.redirect("/404");
        });
});

app.get("/livro/:id", (req, res) => {
    Livro.findOne({ _id: req.params.id })
        .then((livro) => {
            if (livro) res.render("livro/index", { livro: livro.toJSON() });
            else {
                req.flash("errorMessage", "Este livro não existe");
                res.redirect("/");
            }
        })
        .catch((err) => {
            req.flash("errorMessage", "Houve um erro interno");
            res.redirect("/");
        });
});

app.get("/generos", (req, res) => {
    Genero.find()
        .then((generos) => {
            res.render("generos/index", {
                generos: generos.map((genero) => genero.toJSON()),
            });
        })
        .catch((err) => {
            req.flash(
                "errorMessage",
                "Houve um erro interno ao listar os gêneros"
            );
            res.redirect("/");
        });
});

app.get("/generos/:id", (req, res) => {
    Genero.findOne({ _id: req.params.id })
        .then((genero) => {
            if (genero)
                Livro.find({ genero: genero._id })
                    .sort({ data: "desc" })
                    .then((livros) => {
                        res.render("generos/livros", {
                            livros: livros.map((livro) => livro.toJSON()),
                            genero: genero.toJSON(),
                        });
                    })
                    .catch((err) => {
                        req.flash(
                            "errorMessage",
                            "Houve um erro ao listar os livros"
                        );
                        res.redirect("/");
                    });
            else {
                req.flash("errorMessage", "Este gênero não existe");
                res.redirect("/");
            }
        })
        .catch((err) => {
            req.flash(
                "errorMessage",
                "Houve um erro interno ao carregar a página deste gênero"
            );
            res.redirect("/");
        });
});

app.get("/404", (req, res) => {
    res.send("Erro 404!");
});

app.use("/usuario", usuario);
app.use("/admin", admin);

// Rodando servidor
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
