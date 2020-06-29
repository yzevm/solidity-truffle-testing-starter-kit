const eth = require('./eth')

function advanceBlock() {
  return new Promise((resolve, reject) => {
    eth.currentProvider.send(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: Date.now(),
      },
      (err, res) => {
        return err ? reject(err) : resolve(res)
      }
    )
  })
}

// Advances the block number so that the last mined block is `number`.
async function advanceToBlock(number) {
  const blockNumber = await eth.getBlockNumber()

  if (blockNumber > number) {
    throw Error(`block number ${number} is in the past (current is ${web3.eth.blockNumber})`)
  }

  while (blockNumber < number) {
    await advanceBlock()
  }
}

module.exports = {
  advanceBlock,
  advanceToBlock,
}
