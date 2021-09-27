const express = require('express');
const {
  validateProductId,
  validateOptionId,
  validateProductName,
  validateDescription,
  validatePrice,
  validateDeliveryPrice,
  validateProductOptionName,
  validateProductOptionDescription,
  validateRequest,
  validateUUID,
  verifyKey,
} = require('./validation');
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProductById,
  getProductOptionsByProductId,
  getProductOptionByProductIdAndProductOptionId,
  addProductOptionByProductId,
  updateProductionOptionByProductIdAndOptionId,
  deleteProductOptionByProductIdAndProductOptionId,
} = require('../controllers/productsController');

const router = express.Router();

router.get('/products', verifyKey, getAllProducts);

router.get(
  '/products/:id',
  verifyKey,
  [validateProductId()],
  validateRequest,
  validateUUID,
  getProductById
);

router.post(
  '/products',
  verifyKey,
  [
    validateProductName(),
    validateDescription(),
    validatePrice(),
    validateDeliveryPrice(),
  ],
  validateRequest,
  addProduct
);

router.put(
  '/products/:id',
  verifyKey,
  [
    validateProductId(),
    validateProductName(),
    validateDescription(),
    validatePrice(),
    validateDeliveryPrice(),
  ],
  validateRequest,
  validateUUID,
  updateProductById
);

router.delete(
  '/products/:id',
  verifyKey,
  [validateProductId()],
  validateRequest,
  validateUUID,
  deleteProductById
);

router.get(
  '/products/:id/options',
  verifyKey,
  [validateProductId()],
  validateRequest,
  validateUUID,
  getProductOptionsByProductId
);

router.get(
  '/products/:id/options/:optionId',
  verifyKey,
  [validateProductId(), validateOptionId()],
  validateRequest,
  validateUUID,
  getProductOptionByProductIdAndProductOptionId
);

router.post(
  '/products/:id/options',
  verifyKey,
  [
    validateProductId(),
    validateProductOptionName(),
    validateProductOptionDescription(),
  ],
  validateRequest,
  validateUUID,
  addProductOptionByProductId
);

router.put(
  '/products/:id/options/:optionId',
  verifyKey,
  [
    validateProductId(),
    validateOptionId(),
    validateProductOptionName(),
    validateProductOptionDescription(),
  ],
  validateRequest,
  validateUUID,
  updateProductionOptionByProductIdAndOptionId
);

router.delete(
  '/products/:id/options/:optionId',
  verifyKey,
  [validateProductId(), validateOptionId()],
  validateRequest,
  validateUUID,
  deleteProductOptionByProductIdAndProductOptionId
);

module.exports.productRoute = router;
