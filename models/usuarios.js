import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    username:{type:String,require:true}, 
    contraseña:{type:String,require:true},
})
usuarioSchema.methods.encrypt = (contraseña)=>{
    return bcrypt.hashSync(contraseña,bcrypt.genSaltSync(10))
}
usuarioSchema.methods.comparar = (contraseña,passWord)=>{
    return bcrypt.compareSync(contraseña,passWord)
}

export default mongoose.model('usuarios',usuarioSchema)