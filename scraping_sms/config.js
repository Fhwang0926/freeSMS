module.exports = {
  headless : process.env.NODE_ENV == 'production',
  slowMo: 150,
  args: [
    '--incognito',
  ]
}