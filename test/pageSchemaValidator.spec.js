import assert from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import { assertValidPageSchema, isValidPageSchema } from '../src/pageSchemaValidator';

const fixturePath = join(__dirname, 'fixtures', 'validPageSchema.json');

describe('pageSchemaValidator', () => {
  it('validates a correct schema', () => {
    const schema = JSON.parse(readFileSync(fixturePath, 'utf8'));
    const validated = assertValidPageSchema(schema);
    assert.ok(validated.root);
    assert.strictEqual(isValidPageSchema(schema), true);
  });

  it('throws for invalid schemas', () => {
    const invalidSchema = {
      id: 'broken',
      name: 'Broken',
      root: {
        id: 'root',
        type: 'Layout.Stack',
        children: [{}]
      }
    };

    assert.throws(() => assertValidPageSchema(invalidSchema), /Invalid page schema/);
    assert.strictEqual(isValidPageSchema(invalidSchema), false);
  });
});
