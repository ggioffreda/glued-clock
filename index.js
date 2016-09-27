function Clock(clockFile) {
  const fs = require('fs'),
    moment = require('moment');

  // test access on clock JSON file
  try {
    fs.accessSync(clockFile);
  } catch (e) {
    fs.writeFileSync(clockFile, JSON.stringify({}), 'utf8');
  }

  var state = {};
  try {
    state = JSON.parse(fs.readFileSync(clockFile, 'utf8'));
  } catch (e) {
    // go on with empty initial state
  }

  function _computeState(timestamp) {
    return {
      minute: Math.floor(timestamp / 60 / 1000),
      hour: Math.floor(timestamp / 3600 / 1000),
      day: Math.floor(timestamp / 86400 / 1000)
    };
  }

  function _publish(messageBusChannel, context, parts, nowTime) {
    messageBusChannel.publish([ 'clock', context ].concat(parts).join('.'), new Buffer(JSON.stringify(nowTime)));
  }

  this.tick = function (messageBusChannel, state) {
    const now = new Date(),
      mom = moment(now.getTime()),
      nowTime = now.getTime(),
      currentState = _computeState(now.getTime()),
      parts = [ mom.format('YYYY'), mom.format('MM'), mom.format('DD'), mom.format('HH'), mom.format('mm') ];

    if (!state.minute || state.minute !== currentState.minute) {
      _publish(messageBusChannel, 'minute', parts, nowTime);
    }
    if (!state.hour || state.hour !== currentState.hour) {
      _publish(messageBusChannel, 'hour', parts, nowTime);
    }
    if (!state.day || state.day !== currentState.day) {
      _publish(messageBusChannel, 'day', parts, nowTime);
      _publish(messageBusChannel, 'doy', [ mom.dayOfYear() ], nowTime);
      _publish(messageBusChannel, 'dow', [ mom.format('dddd').toLowerCase() ], nowTime);
      if (1 === mom.date()) {
        _publish(messageBusChannel, 'month', [ mom.format('MMMM').toLowerCase() ], nowTime);
        if (0 === mom.month()) {
          _publish(messageBusChannel, 'year', [ now.getUTCFullYear() ], nowTime);
        }
      }
    }

    return currentState;
  };

  this.getName = function () {
    return 'clock';
  };

  this.getState = function () {
    return state;
  };

  this.requires = function (dependency) {
    return 'message-bus' === dependency;
  };

  this.setUp = function (dependencies) {
    var messageBusChannel = dependencies['message-bus'];

    setInterval(function () {
      var currentState = this.tick(messageBusChannel, state);
      if (JSON.stringify(currentState) !== JSON.stringify(state)) {
        fs.writeFileSync(clockFile, JSON.stringify(currentState));
        state = currentState;
      }
    }.bind(this), 167);
  };
}

module.exports.Clock = Clock;
