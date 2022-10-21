'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');

const configSchema = yup.object({
  pageSize: yup.number().required(),
});

module.exports = validateYupSchema(configSchema);
