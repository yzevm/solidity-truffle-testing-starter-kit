module.exports = {
  networks: {
    develop: {
      host: process.env.HOST || 'localhost',
      port: +process.env.PORT || 7545,
      network_id: '*',
      gasPrice: 1,
      gas: 0x1fffffffffffff,
    },
    coverage: {
      host: process.env.HOST || 'localhost',
      port: +process.env.PORT || 7545,
      network_id: '*',
      gasPrice: 1,
      gas: 0x1fffffffffffff,
    },
  },

  plugins: ['solidity-coverage'],

  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      excludeContracts: ['Migrations'],
    },
  },
}
