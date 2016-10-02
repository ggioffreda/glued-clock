#!/usr/bin/env node

const ServiceManager = require('glued-common').ServiceManager
const manager = new ServiceManager()
const Clock = require('../clock').Clock

manager.load(new Clock(process.env.GLUED_CLOCK_FILE || '/tmp/.glued-clock.json'), require('../package.json'))
