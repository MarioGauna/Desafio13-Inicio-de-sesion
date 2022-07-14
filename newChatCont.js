import mongoose from 'mongoose';
import configDB from './configDBMongo.js';

//mongoose.connect(configDB.mongoDB.url,configDB.mongoDB.options)

export default class contMsj {
    constructor(collectionName,docSchema) {
        this.collection = mongoose.model(collectionName,docSchema);
    }
    async save(obj) {
        try {
            return await this.collection.create(obj);
        } catch (error) {
            console.log('Hubo un error al guardar el mensaje',error)
        }
    }
    async getAll() {
        try {
            return await this.collection.find({});
        } catch (error) {
            console.log('Hubo un error al mostrar los mensajes',error)
        }
    }
};