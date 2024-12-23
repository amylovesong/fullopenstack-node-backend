const { test } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

// the test description as a string
test('reserve of a', () => { // the functionality for the test case
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reserve of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})
