'use strict';

const cleanSchemaAttributes = require('./utils/clean-schema-attributes');
const loopContentTypeNames = require('./utils/loop-content-type-names');
const pascalCase = require('./utils/pascal-case');
const hasFindMethod = require('./utils/has-find-method');

/**
 * @decription Get all open api schema objects for a given content type
 *
 * @param {object} apiInfo
 * @property {string} apiInfo.uniqueName - Api name | Api name + Content type name
 * @property {object} apiInfo.attributes - Attributes on content type
 * @property {object} apiInfo.routeInfo - The routes for the api
 *
 * @returns {object} Open API schemas
 */
const getAllSchemasForContentType = ({ routeInfo, attributes, uniqueName }) => {
  // Store response and request schemas in an object
  let schemas = {};
  // Get all the route methods
  const routeMethods = routeInfo.routes.map((route) => route.method);

  // When the route methods contain any post or put requests
  if (routeMethods.includes('POST') || routeMethods.includes('PUT')) {
    const requiredAttributes = Object.entries(attributes)
      .filter(([, attribute]) => attribute.required)
      .map(([attributeName, attribute]) => {
        return { [attributeName]: attribute };
      });

    const requestAttributes =
      routeMethods.includes('POST') && requiredAttributes.length
        ? Object.assign({}, ...requiredAttributes)
        : attributes;

    // Build the request schema
    schemas = {
      ...schemas,
      [`${pascalCase(uniqueName)}Request`]: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: cleanSchemaAttributes(requestAttributes, { isRequest: true }),
          },
        },
      },
    };
  }

  // Check for routes that need to return a list
  const hasListOfEntities = routeInfo.routes.filter((route) => hasFindMethod(route.handler)).length;

  if (hasListOfEntities) {
    // Build the list response schema
    schemas = {
      ...schemas,
      [`${pascalCase(uniqueName)}ListResponse`]: {
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                attributes: { type: 'object', properties: cleanSchemaAttributes(attributes) },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              pagination: {
                properties: {
                  page: { type: 'integer' },
                  pageSize: { type: 'integer', minimum: 25 },
                  pageCount: { type: 'integer', maximum: 1 },
                  total: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    };
  }

  // Build the response schema
  schemas = {
    ...schemas,
    [`${pascalCase(uniqueName)}Response`]: {
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            attributes: { type: 'object', properties: cleanSchemaAttributes(attributes) },
          },
        },
        meta: { type: 'object' },
      },
    },
  };

  return schemas;
};

const buildComponentSchema = (api) => {
  // A reusable loop for building paths and component schemas
  // Uses the api param to build a new set of params for each content type
  // Passes these new params to the function provided
  return loopContentTypeNames(api, getAllSchemasForContentType);
};

module.exports = buildComponentSchema;
