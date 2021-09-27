const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productOptionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      ref: 'Product',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productOptionSchema.statics.build = (attrs) => {
  return new ProductOption(attrs);
};

const ProductOption = mongoose.model('ProductOption', productOptionSchema);

module.exports = ProductOption;
