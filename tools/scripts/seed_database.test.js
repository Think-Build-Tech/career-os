const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { makeSchemaIdempotent } = require('./seed_database');

const schemaSql = fs.readFileSync(
  path.resolve(__dirname, '../../apps/api/src/app/config/schema.sql'),
  'utf8',
);

test('makes the pg_dump schema safe to apply after control-plane bootstrap', () => {
  const transformed = makeSchemaIdempotent(schemaSql);
  const originalConstraintCount = (schemaSql.match(/^ALTER TABLE ONLY public\./gm) || []).length;
  const guardedConstraintCount = (transformed.match(/^DO \$careeros\$/gm) || []).length;

  assert.ok(originalConstraintCount > 0, 'the fixture should contain pg_dump constraints');
  assert.equal(guardedConstraintCount, originalConstraintCount);
  assert.doesNotMatch(transformed, /^SET transaction_timeout/m);
  assert.doesNotMatch(transformed, /^CREATE TABLE public\./m);
  assert.doesNotMatch(transformed, /^CREATE (?:UNIQUE )?INDEX (?!IF NOT EXISTS )/m);
  assert.doesNotMatch(transformed, /^ALTER TABLE ONLY public\./m);
  assert.match(transformed, /^CREATE TABLE IF NOT EXISTS public\.tenants/m);
  assert.match(transformed, /^CREATE UNIQUE INDEX IF NOT EXISTS/m);
  assert.match(transformed, /conrelid = 'public\.tenants'::regclass/);
});

test('schema transformation is idempotent', () => {
  const once = makeSchemaIdempotent(schemaSql);
  const twice = makeSchemaIdempotent(once);
  assert.equal(twice, once);
});
