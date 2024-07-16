import mongoose from 'mongoose';

export const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'uno-game',
        });

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos');
    }
}
