const eth = require('./eth')

class Time {
  static eth = eth

  /**
   * Increases ganache time by the passed duration in seconds
   */
  increase(duration) {
    const id = Date.now()

    return new Promise((resolve, reject) => {
      Time.eth.currentProvider.send(
        {
          jsonrpc: '2.0',
          method: 'evm_increaseTime',
          params: [duration],
          id: id,
        },
        (err1) => {
          if (err1) return reject(err1)

          Time.eth.currentProvider.send(
            {
              jsonrpc: '2.0',
              method: 'evm_mine',
              id: id + 1,
            },
            (err2, res) => {
              return err2 ? reject(err2) : resolve(res)
            }
          )
        }
      )
    })
  }

  /**
   * Returns the time of the last mined block in seconds
   */
  async latest() {
    const { timestamp } = await Time.eth.getBlock('latest')
    return timestamp
  }

  /**
   * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
   * it's hard to increase time precisely to a target point so design your test to tolerate
   * small fluctuations from time to time.
   *
   * @param target time in seconds
   */
  async increaseTo(target) {
    const now = await this.latest()

    if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`)
    const diff = target - now
    return this.increase(diff)
  }

  static duration = {
    seconds: function (val) {
      return val
    },
    minutes: function (val) {
      return val * this.seconds(60)
    },
    hours: function (val) {
      return val * this.minutes(60)
    },
    days: function (val) {
      return val * this.hours(24)
    },
    weeks: function (val) {
      return val * this.days(7)
    },
    years: function (val) {
      return val * this.days(365)
    },
  }
}

module.exports = Time
