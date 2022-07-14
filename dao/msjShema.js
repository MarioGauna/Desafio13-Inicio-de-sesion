import mongoose from "mongoose";

const esqMsj = new mongoose.Schema({
    autor:{
        email:{type:String,require:true},
        nombre:{type:String,require:true},
        apellido:{type:String,require:true},
        edad:{type:Number,require:true},
        alias:{type:String,require:true},
        avatar:{type:String,require:true},
    },
    texto:{type:String,require:true},
    timestamp:{type:String}
})

export default esqMsj;