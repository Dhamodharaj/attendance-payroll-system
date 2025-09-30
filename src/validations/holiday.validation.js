const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createHoliday = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().required(),
    description: Joi.string().optional(),
    status: Joi.number().valid(0, 1).optional().default(1),
  }),
};

const getHolidays = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    status: Joi.number().valid(0, 1),
    name: Joi.string(),
    from_date: Joi.date(),
    to_date: Joi.date(),
  }),
};

const getHoliday = {
  params: Joi.object().keys({
    holidayId: Joi.string().custom(objectId).required(),
  }),
};

const updateHoliday = {
  params: Joi.object().keys({
    holidayId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      from_date: Joi.date().required(),
      to_date: Joi.date().required(),
      description: Joi.string().optional(),
      status: Joi.number().valid(0, 1).optional(),
    })
    .min(1),
};

const deleteHoliday = {
  params: Joi.object().keys({
    holidayId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createHoliday,
  getHolidays,
  getHoliday,
  updateHoliday,
  deleteHoliday,
};
