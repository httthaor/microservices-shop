const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, customerName, customerEmail, items]
 *             properties:
 *               customerId: { type: integer, example: 1 }
 *               customerName: { type: string, example: "Nguyen Van A" }
 *               customerEmail: { type: string, example: "test@example.com" }
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string, example: "123 Le Loi" }
 *                   city: { type: string, example: "TP.HCM" }
 *                   district: { type: string, example: "Quan 1" }
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("/", async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, items, shippingAddress, note } = req.body;
    const processedItems = (items || []).map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    }));
    const totalAmount = processedItems.reduce((sum, i) => sum + i.subtotal, 0);

    const newOrder = await Order.create({
      customerId,
      customerName,
      customerEmail,
      items: processedItems,
      totalAmount,
      shippingAddress,
      note
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;