const GDConfig = import('eslint-config-godaddy').then(module => module?.default || module);
const { defineConfig } = require('eslint/config');

module.exports = defineConfig({
  extends: [GDConfig]
});