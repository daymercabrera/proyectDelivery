const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. CONEXIÓN A LA BASE DE DATOS
const uri = "mongodb+srv://daymer_admin:daymer190803@delivery.0qio1rt.mongodb.net/VestaDB?retryWrites=true&w=majority&appName=delivery";

mongoose.connect(uri)
  .then(() => console.log('¡Conectado a MongoDB Atlas!'))
  .catch(err => console.error('Error al conectar:', err));

// 2. DEFINIR MODELOS (Tablas)
const Pedido = mongoose.model('Pedido', new mongoose.Schema({
  codigo: String, cliente: String, producto: String, cantidad: Number,
  estado: String, color: String, pago: String, total: String,
  celular: String, direccion: String, referencia: String, observacion: String, origen: String
}));

const Repartidor = mongoose.model('Repartidor', new mongoose.Schema({
  id: String, nombre: String, vehiculo: String, zona: String,
  estado: String, color: String, entregas: Number
}));

const Ruta = mongoose.model('Ruta', new mongoose.Schema({
  nombre: String, origen: String, destino: String, pedidos: Number, avance: Number
}));

// 3. RUTAS PARA PEDIDOS
app.get('/api/pedidos', async (req, res) => res.json(await Pedido.find()));
app.post('/api/pedidos', async (req, res) => res.json(await new Pedido(req.body).save()));

// Ruta para ACTUALIZAR un pedido (Ej. de 'En ruta' a 'Entregado')
app.put('/api/pedidos/:codigo', async (req, res) => {
  await Pedido.findOneAndUpdate({ codigo: req.params.codigo }, req.body);
  res.json({ mensaje: 'Pedido actualizado' });
});

// Ruta para ELIMINAR un pedido
app.delete('/api/pedidos/:codigo', async (req, res) => {
  await Pedido.findOneAndDelete({ codigo: req.params.codigo });
  res.json({ mensaje: 'Pedido eliminado' });
});

// 4. RUTAS PARA REPARTIDORES
app.get('/api/repartidores', async (req, res) => res.json(await Repartidor.find()));
app.post('/api/repartidores', async (req, res) => res.json(await new Repartidor(req.body).save()));
app.put('/api/repartidores/:id', async (req, res) => {
  await Repartidor.findOneAndUpdate({ id: req.params.id }, req.body);
  res.json({ mensaje: 'Repartidor actualizado' });
});
app.delete('/api/repartidores/:id', async (req, res) => {
  await Repartidor.findOneAndDelete({ id: req.params.id });
  res.json({ mensaje: 'Repartidor eliminado' });
});

// 5. RUTAS PARA RUTAS (Delivery)
app.get('/api/rutas', async (req, res) => res.json(await Ruta.find()));
app.post('/api/rutas', async (req, res) => res.json(await new Ruta(req.body).save()));
app.delete('/api/rutas/:nombre', async (req, res) => {
  await Ruta.findOneAndDelete({ nombre: req.params.nombre });
  res.json({ mensaje: 'Ruta eliminada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));