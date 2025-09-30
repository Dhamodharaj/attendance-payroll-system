const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createCreditDay = {
  body: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).required(),
    date: Joi.date().required(),
    isUsed: Joi.boolean().optional().default(false),
  }),
};

const getCreditDays = {
  query: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).optional(),
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
  }),
};

const getCreditDay = {
  params: Joi.object().keys({
    creditDayId: Joi.string().custom(objectId).required(),
  }),
};

const updateCreditDay = {
  params: Joi.object().keys({
    creditDayId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      emp_id: Joi.string().custom(objectId).optional(),
      date: Joi.date().optional(),
      isUsed: Joi.boolean().optional(),
    })
    .min(1),
};

const deleteCreditDay = {
  params: Joi.object().keys({
    creditDayId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCreditDay,
  getCreditDays,
  getCreditDay,
  updateCreditDay,
  deleteCreditDay,
};
