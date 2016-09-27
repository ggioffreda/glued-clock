#!/usr/bin/env node

const ServiceManager = require('glued-common').ServiceManager,
  manager = new ServiceManager(),
  Clock = require('../index').Clock;

manager.load(new Clock(process.env.GLUED_CLOCK_FILE || '/tmp/.glued-clock.json'));
