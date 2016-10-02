function Clock (clockFile) {
  const fs = require('fs')
  const moment = require('moment')
  const self = this

  // test access on clock JSON file
  try {
    fs.accessSync(clockFile)
  } catch (e) {
    fs.writeFileSync(clockFile, JSON.stringify({}), 'utf8')
  }

  var state = {}
  try {
    state = JSON.parse(fs.readFileSync(clockFile, 'utf8'))
  } catch (e) {
    // go on with empty initial state
  }

  function _computeState (timestamp) {
    return {
      minute: Math.floor(timestamp / 60 / 1000),
      hour: Math.floor(timestamp / 3600 / 1000),
      day: Math.floor(timestamp / 86400 / 1000)
    }
  }

  function _publish (messageBusChannel, context, parts, nowTime) {
    messageBusChannel.publish([ 'clock', context ].concat(parts).join('.'), new Buffer(JSON.stringify(nowTime)))
  }

  this.tick = function (messageBusChannel, state) {
    const now = new Date()
    const mom = moment(now.getTime())
    const nowTime = now.getTime()
    const currentState = _computeState(now.getTime())
    const parts = [ mom.format('YYYY'), mom.format('MM'), mom.format('DD'), mom.format('HH'), mom.format('mm') ]

    if (!state.minute || state.minute !== currentState.minute) {
      _publish(messageBusChannel, 'minute', parts, nowTime)
    }
    if (!state.hour || state.hour !== currentState.hour) {
      _publish(messageBusChannel, 'hour', parts, nowTime)
    }
    if (!state.day || state.day !== currentState.day) {
      _publish(messageBusChannel, 'day', parts, nowTime)
      _publish(messageBusChannel, 'doy', [ mom.dayOfYear() ], nowTime)
      _publish(messageBusChannel, 'dow', [ mom.format('dddd').toLowerCase() ], nowTime)
      if (mom.date() === 1) {
        _publish(messageBusChannel, 'month', [ mom.format('MMMM').toLowerCase() ], nowTime)
        if (mom.month() === 0) {
          _publish(messageBusChannel, 'year', [ now.getUTCFullYear() ], nowTime)
        }
      }
    }

    return currentState
  }

  this.getName = function () {
    return 'clock'
  }

  this.getState = function () {
    return state
  }

  this.requires = function (dependency) {
    return dependency === 'message-bus'
  }

  this.setUp = function (dependencies) {
    var messageBusChannel = dependencies['message-bus']

    setInterval(function () {
      var currentState = self.tick(messageBusChannel, state)
      if (JSON.stringify(currentState) !== JSON.stringify(state)) {
        fs.writeFileSync(clockFile, JSON.stringify(currentState))
        state = currentState
      }
    }, 167)
  }
}

module.exports.Clock = Clock
