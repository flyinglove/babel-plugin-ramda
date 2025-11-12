import pageSchemaDefinition from './pageSchemaDefinition';

const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value);

function validateDataBinding(binding, path, errors) {
  if (!isObject(binding)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (typeof binding.sourceId !== 'string' || binding.sourceId.trim() === '') {
    errors.push(`${path}.sourceId must be a non-empty string`);
  }
  if (typeof binding.path !== 'string' || binding.path.trim() === '') {
    errors.push(`${path}.path must be a non-empty string`);
  }
  if (binding.transforms) {
    if (!Array.isArray(binding.transforms)) {
      errors.push(`${path}.transforms must be an array when provided`);
    } else {
      binding.transforms.forEach((transform, index) => {
        const transformPath = `${path}.transforms[${index}]`;
        if (!isObject(transform)) {
          errors.push(`${transformPath} must be an object`);
          return;
        }
        if (typeof transform.type !== 'string' || transform.type.trim() === '') {
          errors.push(`${transformPath}.type must be a non-empty string`);
        }
        if (transform.props && !isObject(transform.props)) {
          errors.push(`${transformPath}.props must be an object when provided`);
        }
      });
    }
  }
}

function validateEvents(events, path, errors) {
  if (!isObject(events)) {
    errors.push(`${path} must be an object`);
    return;
  }
  Object.entries(events).forEach(([eventName, actions]) => {
    if (!Array.isArray(actions)) {
      errors.push(`${path}.${eventName} must be an array of actions`);
      return;
    }
    actions.forEach((action, index) => {
      const actionPath = `${path}.${eventName}[${index}]`;
      if (!isObject(action)) {
        errors.push(`${actionPath} must be an object`);
        return;
      }
      if (typeof action.type !== 'string' || action.type.trim() === '') {
        errors.push(`${actionPath}.type must be a non-empty string`);
      }
      if (action.params && !isObject(action.params)) {
        errors.push(`${actionPath}.params must be an object when provided`);
      }
    });
  });
}

function validateLayout(layout, path, errors) {
  if (!isObject(layout)) {
    errors.push(`${path} must be an object`);
    return;
  }
  ['width', 'height'].forEach(key => {
    if (layout[key] !== undefined && typeof layout[key] !== 'string' && typeof layout[key] !== 'number') {
      errors.push(`${path}.${key} must be a string or number when provided`);
    }
  });
  ['display', 'position', 'gridArea'].forEach(key => {
    if (layout[key] !== undefined && typeof layout[key] !== 'string') {
      errors.push(`${path}.${key} must be a string when provided`);
    }
  });
  if (layout.order !== undefined && typeof layout.order !== 'number') {
    errors.push(`${path}.order must be a number when provided`);
  }
}

function validateComponent(component, path, errors) {
  if (!isObject(component)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (typeof component.id !== 'string' || component.id.trim() === '') {
    errors.push(`${path}.id must be a non-empty string`);
  }
  if (typeof component.type !== 'string' || component.type.trim() === '') {
    errors.push(`${path}.type must be a non-empty string`);
  }

  if (component.variant !== undefined && typeof component.variant !== 'string') {
    errors.push(`${path}.variant must be a string when provided`);
  }
  if (component.props !== undefined && !isObject(component.props)) {
    errors.push(`${path}.props must be an object when provided`);
  }
  if (component.styles !== undefined && !isObject(component.styles)) {
    errors.push(`${path}.styles must be an object when provided`);
  }
  if (component.layout !== undefined) {
    validateLayout(component.layout, `${path}.layout`, errors);
  }
  if (component.dataBindings !== undefined) {
    if (!isObject(component.dataBindings)) {
      errors.push(`${path}.dataBindings must be an object`);
    } else {
      Object.entries(component.dataBindings).forEach(([bindingName, binding]) => {
        validateDataBinding(binding, `${path}.dataBindings.${bindingName}`, errors);
      });
    }
  }
  if (component.events !== undefined) {
    validateEvents(component.events, `${path}.events`, errors);
  }
  if (component.conditional !== undefined) {
    if (!isObject(component.conditional)) {
      errors.push(`${path}.conditional must be an object`);
    } else {
      if (component.conditional.visible !== undefined && typeof component.conditional.visible !== 'boolean') {
        errors.push(`${path}.conditional.visible must be a boolean when provided`);
      }
      if (component.conditional.predicate !== undefined && typeof component.conditional.predicate !== 'string') {
        errors.push(`${path}.conditional.predicate must be a string when provided`);
      }
    }
  }

  if (component.children !== undefined) {
    if (!Array.isArray(component.children)) {
      errors.push(`${path}.children must be an array when provided`);
    } else {
      component.children.forEach((child, index) => {
        validateComponent(child, `${path}.children[${index}]`, errors);
      });
    }
  }
}

function validateDataSources(dataSources, path, errors) {
  if (!Array.isArray(dataSources)) {
    errors.push(`${path} must be an array`);
    return;
  }
  dataSources.forEach((source, index) => {
    const sourcePath = `${path}[${index}]`;
    if (!isObject(source)) {
      errors.push(`${sourcePath} must be an object`);
      return;
    }
    if (typeof source.id !== 'string' || source.id.trim() === '') {
      errors.push(`${sourcePath}.id must be a non-empty string`);
    }
    if (typeof source.type !== 'string' || source.type.trim() === '') {
      errors.push(`${sourcePath}.type must be a non-empty string`);
    }
    if (!isObject(source.config)) {
      errors.push(`${sourcePath}.config must be an object`);
    }
    if (source.provides !== undefined) {
      if (!Array.isArray(source.provides)) {
        errors.push(`${sourcePath}.provides must be an array when provided`);
      } else if (source.provides.some(item => typeof item !== 'string')) {
        errors.push(`${sourcePath}.provides must contain only strings`);
      }
    }
  });
}

export function validatePageSchema(schema) {
  return assertValidPageSchema(schema);
}

export function isValidPageSchema(schema) {
  try {
    assertValidPageSchema(schema);
    return true;
  } catch (error) {
    return false;
  }
}

export function assertValidPageSchema(schema) {
  const errors = [];

  if (!isObject(schema)) {
    throw new Error('Invalid page schema: schema must be an object');
  }

  if (typeof schema.id !== 'string' || schema.id.trim() === '') {
    errors.push('schema.id must be a non-empty string');
  }
  if (typeof schema.name !== 'string' || schema.name.trim() === '') {
    errors.push('schema.name must be a non-empty string');
  }

  if (schema.version !== undefined && typeof schema.version !== 'string') {
    errors.push('schema.version must be a string when provided');
  }
  if (schema.locale !== undefined && typeof schema.locale !== 'string') {
    errors.push('schema.locale must be a string when provided');
  }
  if (schema.metadata !== undefined && !isObject(schema.metadata)) {
    errors.push('schema.metadata must be an object when provided');
  }
  if (schema.dataSources !== undefined) {
    validateDataSources(schema.dataSources, 'schema.dataSources', errors);
  }

  if (schema.root === undefined) {
    errors.push('schema.root is required');
  } else {
    validateComponent(schema.root, 'schema.root', errors);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid page schema: ${errors.join('; ')}`);
  }

  return schema;
}

export const pageSchema = pageSchemaDefinition;

export default pageSchemaDefinition;
