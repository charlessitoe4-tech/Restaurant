require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const ordersRoutes = require('./src/routes/orders');
const receiptsRoutes = require('./src/routes/receipts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API do restaurante funcionando.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/receipts', receiptsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
});

async function start() {
  try {
    const result = await testConnection();
    console.log('Conexão MySQL OK. Resultado:', result);

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    process.exit(1);
  }
}

start();
