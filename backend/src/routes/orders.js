const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `
      SELECT o.*, u.full_name AS created_by_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.created_by_user_id
      ORDER BY o.created_at DESC
      `
    );

    const [items] = await pool.query('SELECT * FROM order_items ORDER BY id ASC');

    const itemsByOrder = items.reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const result = orders.map((order) => ({
      ...order,
      items: itemsByOrder[order.id] || [],
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar pedidos.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { customerName, customerEmail, orderType, deliveryAddress, items, total, status } = req.body;

  if (!customerName || !customerEmail || !items || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Dados do pedido incompletos.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO orders (customer_name, customer_email, order_type, delivery_address, total, status, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customerName, customerEmail, orderType || 'mesa', deliveryAddress || null, Number(total) || 0, status || 'pendente', req.user.id]
    );

    const orderId = result.insertId;

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, item_name, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, Number(item.quantity) || 1, Number(item.price) || 0, Number(item.total) || 0]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Pedido criado com sucesso.',
      orderId,
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: 'Erro ao criar pedido.', error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
