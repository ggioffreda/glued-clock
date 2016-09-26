#!/usr/bin/env node

const ProcessorManager = require('glued-common').ProcessorManager,
  manager = new ProcessorManager(),
  Clock = require('../index').Clock;

manager.load(new Clock(process.env.GLUED_CLOCK_FILE || '/tmp/.glued-clock.json'));
