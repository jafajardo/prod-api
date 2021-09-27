const Product = require('../models/product');
const ProductOption = require('../models/productOption');

// `GET /products` - gets all products.
// `GET /products?name={name}` - finds all products matching the specified name.
const getAllProducts = async (req, res) => {
  let { name } = req.query;
  let { limit, page } = req.query;
  let response = {};
  let products = [];

  try {
    // Defaults limit of products to return
    if (!limit) {
      limit = '5';
    }

    // Defaults offset to the start of the collection
    if (!page) {
      page = '1';
    }

    if (parseInt(page) < 1) {
      response = {
        success: false,
        message: 'Page query parameter must be greater 0',
      };
      return res.status(400).send(response);
    }

    if (parseInt(limit) < 1) {
      response = {
        success: false,
        message: 'Limit query parameter must be greater 0',
      };
      return res.status(400).send(response);
    }

    if (!name) {
      products = await Product.find({})
        .limit(parseInt(limit))
        .skip(parseInt(limit) * (parseInt(page) - 1))
        .populate('productOptions');
    } else {
      // Convert special characters to ascii
      name = escape(name);
      // Another solution to case-insensitive matching is to add a new
      // property in the model that saves a lowercase version of name
      // and do a find against it.

      // RegExp to make matching of name parameter case-insensitive
      products = await Product.find({
        name: { $regex: new RegExp(`^${name.toLowerCase()}`, 'i') },
      })
        .limit(parseInt(limit))
        .skip(parseInt(limit) * (parseInt(page) - 1))
        .populate('productOptions');
    }

    response = { success: true, data: { items: products } };
    return res.status(200).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `GET /products/{id}` - gets the project that matches the specified ID - ID is a GUID.
const getProductById = async (req, res) => {
  const { id } = req.params;
  let response = {};

  try {
    const product = await Product.findById(id).populate('productOptions');

    if (!product) {
      response = { success: false, message: 'Product not found' };
      return res.status(400).send(response);
    }

    response = { success: true, data: product };
    return res.status(200).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `POST /products` - creates a new product.
const addProduct = async (req, res) => {
  const { name, description, price, deliveryPrice } = req.body;
  let response = {};

  try {
    const newProduct = Product.build({
      name,
      description,
      price,
      deliveryPrice,
    });
    await newProduct.save();
    response = { success: true, data: newProduct };
    return res.status(201).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `PUT /products/{id}` - updates a product.
const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, deliveryPrice } = req.body;
  let response = {};

  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      response = {
        success: false,
        message: 'The product you are trying to update was not found',
      };
      return res.status(400).send(response);
    }

    existingProduct?.set({
      name,
      description,
      price,
      deliveryPrice,
    });
    await existingProduct.save();

    response = { success: true, data: existingProduct };
    return res.status(200).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `DELETE /products/{id}` - deletes a product and its options.
const deleteProductById = async (req, res) => {
  const { id } = req.params;
  let response = {};

  try {
    const existingProduct = await Product.findById(id).populate(
      'productOptions'
    );

    if (!existingProduct) {
      response = {
        success: false,
        message: 'The product you are trying to delete was not found',
      };
      return res.status(400).send(response);
    }

    await Product.deleteOne({ _id: existingProduct.id });
    for (const productOptionId of existingProduct.productOptions) {
      await ProductOption.deleteOne({ _id: productOptionId });
    }

    response = { success: true, data: existingProduct };
    return res.status(204).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `GET /products/{id}/options` - finds all options for a specified product.
const getProductOptionsByProductId = async (req, res) => {
  const { id } = req.params;
  let response = {};

  try {
    const existingProduct = await Product.findById(id).populate(
      'productOptions'
    );

    if (!existingProduct) {
      response = { success: false, message: 'Product was not found' };
      return res.status(400).send(response);
    }

    const productOptions = existingProduct.productOptions;
    response = { success: true, data: { items: productOptions } };
    return res.status(200).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `GET /products/{id}/options/{optionId}` - finds the specified product option for the specified product.
const getProductOptionByProductIdAndProductOptionId = async (req, res) => {
  const { id, optionId } = req.params;
  let response = {};

  try {
    const existingProduct = await Product.findById(id).populate(
      'productOptions'
    );

    // Product does not exist
    if (!existingProduct) {
      response = { success: false, message: 'Product was not found' };
      return res.status(400).send(response);
    }

    // Empty product options
    if (
      !existingProduct.populated('productOptions') ||
      !existingProduct.populated('productOptions')?.includes(optionId)
    ) {
      response = {
        success: false,
        message: 'Product option was not found in this product',
      };
      return res.status(400).send(response);
    }

    const productOption = await ProductOption.findById(optionId).populate(
      'product'
    );

    if (!productOption) {
      response = { success: false, message: 'Product option was not found' };
      return res.status(400).send(response);
    }

    if (!productOption.populated('product').includes(id)) {
      response = {
        success: false,
        message: 'Product option does not belong to the given product',
      };
      return res.status(400).send(response);
    }

    response = { success: true, data: productOption };
    return res.status(200).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `POST /products/{id}/options` - adds a new product option to the specified product.
const addProductOptionByProductId = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  let response = {};

  try {
    // Retreive product matching product id
    const existingProduct = await Product.findById(id);

    // Check for product id
    if (!existingProduct) {
      response = { success: false, message: 'Product was not found' };
      return res.status(400).send(response);
    }

    // Exists - Create product option
    const productOption = ProductOption.build({
      name,
      description,
      product: existingProduct.id,
    });
    await productOption.save();

    // Update product with new product option id
    existingProduct.set({
      productOptions: [...existingProduct.productOptions, productOption.id],
    });
    await existingProduct.save();

    response = { success: true, data: productOption };
    return res.status(201).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `PUT /products/{id}/options/{optionId}` - updates the specified product option.
const updateProductionOptionByProductIdAndOptionId = async (req, res) => {
  const { id, optionId } = req.params;
  const { name, description } = req.body;
  let response = {};

  try {
    // Retreive product matching product id
    const existingProduct = await Product.findById(id).populate(
      'productOptions'
    );

    // Check for product id
    if (!existingProduct) {
      response = { success: false, message: 'Product was not found' };
      return res.status(400).send(response);
    }

    const productOption = await ProductOption.findById(optionId);

    if (!productOption) {
      response = { success: false, message: 'Product option was not found' };
      return res.status(400).send(response);
    }

    if (
      !existingProduct.populated('productOptions').includes(productOption.id)
    ) {
      response = {
        success: false,
        message: 'Product option does not belong to this product',
      };
      return res.status(400).send(response);
    }

    productOption?.set({
      name,
      description,
    });
    await productOption.save();

    response = { success: true, data: productOption };
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

// `DELETE /products/{id}/options/{optionId}` - deletes the specified product option.
const deleteProductOptionByProductIdAndProductOptionId = async (req, res) => {
  const { id, optionId } = req.params;
  let response = {};

  try {
    // Retreive product matching product id
    const existingProduct = await Product.findById(id).populate(
      'productOptions'
    );

    // Check for product id
    if (!existingProduct) {
      response = { success: false, message: 'Product was not found' };
      return res.status(400).send(response);
    }

    const productOption = await ProductOption.findById(optionId);

    if (!productOption) {
      response = { success: false, message: 'Product option was not found' };
      return res.status(400).send(response);
    }

    if (
      !existingProduct.populated('productOptions').includes(productOption.id)
    ) {
      response = {
        success: false,
        message: 'Product option does not belong to this product',
      };
      return res.status(400).send(response);
    }

    await ProductOption.deleteOne({ _id: productOption.id });

    const newOptions = existingProduct
      .populated('productOptions')
      .filter((id) => id !== productOption.id);

    existingProduct.set({
      productOptions: newOptions,
    });
    await existingProduct.save();

    response = { success: false, data: productOption };
    return res.status(204).send(response);
  } catch (err) {
    response = { success: false, message: err.message };
    return res.status(500).send(response);
  }
};

module.exports = {
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
};
