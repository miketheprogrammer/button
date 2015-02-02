module.exports = {
  server: {
    port: 3000,
    addr: "0.0.0.0",
    name: "ButtonApp",
  },
  headerDefaults: {
    accept: ['application/json']
  },
  database: {
    // maintain reproducibility in our tests by using an in memory backend.
    backend: 'memdown'
  }
}