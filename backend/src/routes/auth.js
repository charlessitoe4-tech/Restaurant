const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao autenticar.', error: error.message });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: 'Identificador e nova senha são obrigatórios.' });
  }

  if (String(newPassword).length < 4) {
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 4 caracteres.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Utilizador não encontrado para redefinição.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, rows[0].id]
    );

    return res.json({
      message: 'Senha redefinida com sucesso.',
      user: {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email,
        role: rows[0].role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao redefinir a senha.', error: error.message });
  }
});

module.exports = router;
