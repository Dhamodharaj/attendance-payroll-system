const Joi = require("joi");
const { objectId } = require("./custom.validation");
const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

const createAttendance = {
  body: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).required(),
    date: Joi.date().required(),
    start_time: Joi.string().pattern(timeRegex).optional(),
    end_time: Joi.string().pattern(timeRegex).optional(),
    notes: Joi.string().optional(),
    isAbsent: Joi.boolean().optional().default(false),
  }),
};

const createMultiple = {
  body: Joi.object().keys({
    data: Joi.array()
      .items(
        Joi.object().keys({
          emp_id: Joi.string().custom(objectId).required(),
          date: Joi.date().required(),
          start_time: Joi.string().pattern(timeRegex).optional(),
          end_time: Joi.string().pattern(timeRegex).optional(),
          notes: Joi.string().optional(),
          isAbsent: Joi.boolean().optional().default(false),
        })
      )
      .required(),
  }),
};

const getAttendances = {
  query: Joi.object().keys({
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    emp_id: Joi.string().custom(objectId),
    date: Joi.date(),
    isAbsent: Joi.boolean(),
  }),
};

const workReport = {
  query: Joi.object().keys({
    start_date: Joi.date().required(),
    emp_id: Joi.string().custom(objectId).optional(),
    end_date: Joi.date().required(),
  }),
};

const getAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.string().custom(objectId).required(),
  }),
};

const updateAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      date: Joi.date().optional(),
      start_time: Joi.string().pattern(timeRegex).optional(),
      end_time: Joi.string().pattern(timeRegex).optional(),
      notes: Joi.string().optional(),
      isAbsent: Joi.boolean().optional(),
    })
    .min(1),
};

const deleteAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  createMultiple,
  workReport
};
