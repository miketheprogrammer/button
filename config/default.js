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
    // leveldown backend for levelup. //Persistant key,value storage in a log strctured merge tree.
    backend: 'leveldown'
  }
}