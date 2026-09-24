const express = require('express');
const nodemailer = require('nodemailer');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', async (req, res) => {
  const { orderId, customerName, customerEmail, issuedByName, receiptHtml } = req.body;

  if (!orderId || !customerName || !customerEmail) {
    return res.status(400).json({ message: 'Dados do recibo incompletos.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO receipts (order_id, customer_name, customer_email, issued_by_user_id, issued_by_name, receipt_html)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Number(orderId), customerName, customerEmail, req.user.id, issuedByName || req.user.fullName || req.user.username, receiptHtml || '']
    );

    return res.status(201).json({
      message: 'Recibo salvo com sucesso.',
      receiptId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao gerar recibo.', error: error.message });
  }
});

router.post('/send-email', async (req, res) => {
  const { to, subject, html, fromName } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: 'Destinatário, assunto e conteúdo são obrigatórios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `${fromName || 'Restaurante'} <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return res.json({ message: 'E-mail enviado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
  }
});

module.exports = router;
