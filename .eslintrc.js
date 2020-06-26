module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  "plugins": [
    "vue"
  ],
  "rules": {
    "camelcase": [0, {
      "properties": "always"
    }]
  }
}
