const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1); // Terminar la aplicación en caso de error
    }
};

module.exports = connectDB;
