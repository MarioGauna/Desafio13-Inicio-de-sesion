import mongoose from "mongoose";

mongoose.connect(
    'mongodb+srv://gauna_mario:D8GuMWgPoTICAKPv@cluster0.1vxmmjy.mongodb.net/desafio13Passport?retryWrites=true&w=majority',
    { useNewUrlParser: true, 
    useUnifiedTopology: true 
    }
)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.log(err));