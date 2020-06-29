const web3 = require('web3')

const host = process.env.HOST || 'localhost'
const port = +process.env.PORT || 7545

module.exports = new web3.modules.Eth(`http://${host}:${port}`)
