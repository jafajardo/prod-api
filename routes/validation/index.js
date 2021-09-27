const { body, param, validationResult } = require('express-validator');
const { uuidRegex } = require('../../common');
const jwt = require('jsonwebtoken');

const validateProductId = () => {
  return param('id').not().isEmpty().withMessage('id parameter is required');
};

const validateOptionId = () => {
  return param('optionId')
    .not()
    .isEmpty()
    .withMessage('optionId parameter is required');
};

const validateProductName = () => {
  return body('name').not().isEmpty().withMessage('name parameter is required');
};

const validateDescription = () => {
  return body('description')
    .not()
    .isEmpty()
    .withMessage('description parameter is required');
};

const validatePrice = () => {
  return body('price')
    .not()
    .isEmpty()
    .withMessage('price parameter is required');
};

const validateDeliveryPrice = () => {
  return body('deliveryPrice')
    .not()
    .isEmpty()
    .withMessage('deliverPrice parameter is required');
};

const validateProductOptionName = () => {
  return body('name').not().isEmpty().withMessage('name parameter is required');
};

const validateProductOptionDescription = () => {
  return body('description')
    .not()
    .isEmpty()
    .withMessage('description parameter is required');
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(500).send({ success: false, message: errors.array() });
  }

  next();
};

const validateUUID = (req, res, next) => {
  if (req.params.id && !uuidRegex.test(req.params.id)) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid id parameter' });
  }

  if (req.params.optionId && !uuidRegex.test(req.params.optionId)) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid option id parameter' });
  }

  next();
};

const verifyKey = async (req, res, next) => {
  const key = req.headers.k;

  try {
    if (!key) {
      return res
        .status(401)
        .send({ success: false, message: 'Unauthorised access' });
    }

    await jwt.verify(key, process.env.JWT_KEY);

    next();
  } catch (err) {
    return res
      .status(401)
      .send({ success: false, message: 'Unauthorised access' });
  }
};

module.exports = {
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
};
