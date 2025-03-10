module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-properties': false,
      },
      browsers: [
        '>0.2%',
        'not dead',
        'not op_mini all',
        'last 2 versions'
      ]
    }
  }
}
