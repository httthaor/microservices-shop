const router = require("express").Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage} = require("../controllers/productController");
const { productValidation } = require("../middleware/validate");
const { upload } = require("../config/cloudinary");

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thành công
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.get("/", getProducts);
router.post("/", productValidation, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   put:
 *     summary: Cập nhật thông tin sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa sản phẩm (Soft delete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Đã ẩn sản phẩm thành công
 */
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
// Upload ảnh sản phẩm
/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     summary: Upload ảnh cho sản phẩm lên Cloudinary
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh sản phẩm (jpg, png, webp, max 5MB)
 *     responses:
 *       200:
 *         description: Tải ảnh thành công, trả về thông tin sản phẩm có link imageUrl
 *       400:
 *         description: Thiếu file hoặc file không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.post("/:id/image", upload.single("image"), uploadProductImage);

module.exports = router;