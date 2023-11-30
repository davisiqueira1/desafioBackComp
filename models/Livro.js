const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Livro = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    paginas: {
        type: Number,
        required: true,
    },
    autor: {
        type: String,
        required: true,
    },
    editora: {
        type: String,
        required: true,
    },
    genero: {
        type: Schema.Types.ObjectId,
        ref: "generos",
        required: true,
    },
    data: {
        type: Date,
    },
});

mongoose.model("livros", Livro);
