const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  image_url: Joi.string().uri().allow('', null),
  category_id: Joi.number().integer().positive().allow(null),
  stock: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  description: Joi.string().allow('', null),
  price: Joi.number().positive(),
  image_url: Joi.string().uri().allow('', null),
  category_id: Joi.number().integer().positive().allow(null),
  stock: Joi.number().integer().min(0),
  is_active: Joi.boolean(),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
