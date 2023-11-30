const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Genero = new Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
    },
});

mongoose.model("generos", Genero);
