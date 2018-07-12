/* global chrome */
const child_process = require('child_process') // eslint-disable-line camelcase
const { getJS } = require('guld-env')
var spawn

function getSpawn () {
  if (spawn) return spawn
  else if (getJS().startsWith('node')) spawn = nodeSpawn
  else if (typeof chrome !== 'undefined') spawn = chromeSpawn
  else throw new Error('No spawn available for this environment.')
  return spawn
}

async function chromeSpawn (command, stdin, args = []) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage(`com.guld.${command}`,
      {'cmd': args.join(' '), 'stdin': stdin},
      response => {
        if (!response) {
          reject(chrome.runtime.lastError)
        } else {
          response = JSON.parse(response)
          if (response.error && response['error'].length !== 0) {
            reject(response.error)
          } else {
            resolve([response['output']])
          }
        }
      }
    )
  })
}

async function nodeSpawn (command, stdin, args = [], redirectErr = false) {
  return new Promise((resolve, reject) => {
    const proc = child_process.spawn(command, args) // eslint-disable-line camelcase
    const buffers = []
    let buffersLength = 0
    let stderr = ''
    proc.stdout.on('data', function (buf) {
      buffers.push(buf)
      buffersLength += buf.length
    })
    proc.stderr.on('data', function (buf) {
      if (!redirectErr) {
        stderr += buf.toString('utf8')
      } else {
        buffers.push(buf)
        buffersLength += buf.length
      }
    })
    proc.on('close', function (code) {
      var stdout = Buffer.concat(buffers, buffersLength)
      if (code !== 0 && stderr !== '') reject(new Error(stderr))
      stdout = stdout.toString('utf-8')
      resolve(stdout)
    })
    if (stdin && stdin.length > 0) {
      proc.stdin.end(stdin)
    }
  })
}

module.exports = {
  nodeSpawn: nodeSpawn,
  chromeSpawn: chromeSpawn,
  getSpawn: getSpawn
}
