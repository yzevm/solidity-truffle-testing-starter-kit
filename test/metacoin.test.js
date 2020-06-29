const MetaCoin = artifacts.require('MetaCoin')
const Time = require('./utils/Time')
const { advanceBlock } = require('./utils/advanceToBlock')

contract('MetaCoin', (accounts) => {
  describe('Balance logic', () => {
    let metaCoinInstance

    beforeEach(async () => {
      metaCoinInstance = await MetaCoin.new()
    })

    it('should put 10000 MetaCoin in the first account', async () => {
      const balance = await metaCoinInstance.getBalance.call(accounts[0])

      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account")
    })

    it('should call a function that depends on a linked library', async () => {
      const metaCoinBalance = (await metaCoinInstance.getBalance.call(accounts[0])).toNumber()
      const metaCoinEthBalance = (await metaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber()

      assert.equal(
        metaCoinEthBalance,
        2 * metaCoinBalance,
        'Library function returned unexpected function, linkage may be broken'
      )
    })

    it('should send coin correctly', async () => {
      // Setup 2 accounts.
      const accountOne = accounts[0]
      const accountTwo = accounts[1]

      // Get initial balances of first and second account.
      const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber()
      const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber()

      // Make transaction from first account to second.
      const amount = 10
      await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne })

      // Get balances of first and second account after the transactions.
      const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber()
      const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber()

      assert.equal(
        accountOneEndingBalance,
        accountOneStartingBalance - amount,
        "Amount wasn't correctly taken from the sender"
      )
      assert.equal(
        accountTwoEndingBalance,
        accountTwoStartingBalance + amount,
        "Amount wasn't correctly sent to the receiver"
      )
    })
  })

  describe('Time logic', () => {
    let metaCoinInstance
    let time

    beforeEach(async () => {
      await advanceBlock()
      metaCoinInstance = await MetaCoin.new()
      time = new Time(metaCoinInstance)
    })

    it('day should passed with diff of plus 1 second', async () => {
      const before = await metaCoinInstance.isDayPassed.call()
      await time.increaseTo((await time.latest()) + Time.duration.days(1) + Time.duration.minutes(1))
      const after = await metaCoinInstance.isDayPassed.call()
      assert.equal(before, false)
      assert.equal(after, true)
    })

    it("day shouldn't passed with diff of minus 1 minutes", async () => {
      const before = await metaCoinInstance.isDayPassed.call()
      await time.increaseTo((await time.latest()) + Time.duration.days(1) - Time.duration.minutes(1))
      const after = await metaCoinInstance.isDayPassed.call()
      assert.equal(before, false)
      assert.equal(after, false)
    })
  })
})
