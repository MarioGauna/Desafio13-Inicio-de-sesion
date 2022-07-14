const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre:{type:String,require:true}, 
    contraseña:{type:String,require:true},
})

module.exports = usuarioSchema;