import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          semi: false,
          singleQuote: true,
          trailingComma: 'none'
        }
      ]
    }
  }
]
