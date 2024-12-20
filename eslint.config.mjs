import globals from "globals"
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended, // make use of ESLint's recommended settings and ensures that they are applied first
  {
    files: ["**/*.js"], // all JavaScript files in the project folder
    languageOptions: {
      sourceType: "commonjs", // JavaScript code uses the CommonJs module system
      globals: { // specifies global variables that are predefined
        ...globals.node, // include all global variables defined in the globals.note setting such as process
      },
      ecmaVersion: 'latest', // lint the latest JavaScript syntax and features
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 'off' // disable a rule by 0 or 'off'
    }
  },
  {
    ignores: ["dist/**", "build/**"]
  }
]
