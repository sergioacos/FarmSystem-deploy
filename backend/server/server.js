const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
//CONEXION BD EN EL ARCHIVO .env
//PORT=5000
//USER=farmaciadb
//PASSWORD=fqeE8Zm8DQYuOslKZ
//DBNAME=farmacia
const PORT = process.env.PORT || 5001;
//const uri =  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@clusterfarmacia.8vvwtum.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=ClusterFarmacia`;
const uri = process.env.MONGODB_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => {
  console.log('Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
});
