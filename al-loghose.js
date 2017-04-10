#! /usr/bin/env node

var minimist = require('minimist')
var loghose = require('./lib/loghose')
var through = require('through2')
var syslog = require ('syslog')

module.exports = loghose

function start () {

 var argv = minimist(process.argv.slice(2), {
    boolean: ['json'],
    alias: {
      'help': 'h',
      'json': 'j',
      'newline': 'n'
    },
    default: {
      json: false,
      newline: false
    }
  })

 if (argv.help) {
    console.log('Usage: docker-loghose [--json] [--newline] [--help]\n' +
                '                      [--matchByImage REGEXP] [--matchByName REGEXP]\n' +
                '                      [--skipByImage REGEXP] [--skipByName REGEXP]\n' +
                '                      [--syslog_target IPADDR] [--syslog_port PORTNUM]')
    process.exit(1)
  }

 var opts = {
        json: argv.json,
        docker: argv.docker,
        events: argv.events,
        newline: argv.newline,
        matchByName: argv.matchByName,
        matchByImage: argv.matchByImage,
        skipByName: argv.skipByName,
        skipByImage: argv.skipByImage,
        includeCurrentContainer: false
  }

  var syslog_target = '127.0.0.1'
  if (argv.syslog_target) {
        syslog_target = argv.syslog_target
  }

  var syslog_port = '1515'
  if (argv.syslog_port) {
        syslog_port = argv.syslog_port
  }

  var logger = syslog.createClient(syslog_port, syslog_target, { faculty: '1' })
  var payload = ''

  loghose(opts).pipe(through.obj(function (chunk, enc, cb) {
    payload = JSON.parse(JSON.stringify(chunk))
    logger.log(payload.line, payload.name, payload.image)
    this.push(JSON.stringify(payload.line))
    this.push('\n')
    cb()
    })).pipe(process.stdout)
}

if (require.main === module) {
  start()
}
