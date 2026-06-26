const Joi = require('joi');

const createOrderSchema = Joi.object({
  customer_name: Joi.string().min(1).max(200).required(),
  customer_email: Joi.string().email().required(),
  customer_phone: Joi.string().allow('', null),
  shipping_address: Joi.object({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().default('US'),
  }).required(),
  notes: Joi.string().allow('', null),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),
});

module.exports = { createOrderSchema, updateStatusSchema };
