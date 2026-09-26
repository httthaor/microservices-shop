const { PrismaClient } = require("@prisma/client");
const redisClient = require("../config/redis");

const prisma = new PrismaClient();
const CACHE_KEY_PRODUCTS = "products:all";

// GET /api/products (Cache 5 phút)
const getProducts = async (req, res, next) => {
  try {
    // 1. Kiểm tra cache Redis
    const cached = await redisClient.get(CACHE_KEY_PRODUCTS);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cached)
      });
    }

    // 2. Cache MISS -> Query DB Supabase
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true }
    });

    // 3. Lưu vào Redis TTL 300 giây (5 phút)
    await redisClient.set(CACHE_KEY_PRODUCTS, JSON.stringify(products), { EX: 300 });

    res.setHeader("X-Cache", "MISS");
    res.json({
      success: true,
      source: "database",
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, slug, description, price, stock, categoryId } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, slug, description, price, stock, categoryId }
    });

    // Xóa cache danh sách cũ
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await prisma.product.update({
      where: { id },
      data: req.body
    });

    // Xóa cache danh sách cũ
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    // Xóa cache danh sách cũ
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.json({ success: true, message: "Đã xóa mềm sản phẩm" });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/:id/image
const uploadProductImage = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh (field: 'image')" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: req.file.path }
    });

    // Xóa cache khi cập nhật ảnh mới
    await redisClient.del(CACHE_KEY_PRODUCTS);

    res.json({ success: true, message: "Tải ảnh sản phẩm thành công", data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};