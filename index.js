const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Permite recibir datos en formato JSON y conectar con tu Frontend
app.use(express.json());
app.use(cors()); 

// 1. CONEXIÓN A LA BASE DE DATOS
// Reemplaza ESTA CADENA por la que tienes en tu bloc de notas
const uri = "mongodb+srv://daymer_admin:daymer190803@delivery.0qio1rt.mongodb.net/?appName=delivery";

mongoose.connect(uri)
  .then(() => console.log('¡Conectado exitosamente a MongoDB Atlas!'))
  .catch(err => console.error('Error al conectar:', err));

// 2. DEFINIR EL MODELO (Igual a la estructura de tu script.js actual)
const pedidoSchema = new mongoose.Schema({
  codigo: String,
  cliente: String,
  producto: String,
  cantidad: Number,
  estado: String,
  color: String,
  pago: String,
  total: String,
  origen: String
});

// Esto creará una colección llamada "pedidos" en MongoDB
const Pedido = mongoose.model('Pedido', pedidoSchema); 

// 3. RUTAS (ENDPOINTS) - Reemplazan al localStorage
// Ruta para LEER los pedidos (equivalente a obtenerDatos)
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find(); // Busca todos los registros
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Ruta para CREAR un pedido (equivalente a guardarDatos)
app.post('/api/pedidos', async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save(); // Guarda físicamente en la nube
    res.json({ mensaje: 'Pedido creado exitosamente', pedido: nuevoPedido });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar pedido' });
  }
});

// 4. INICIAR EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});