const pify = require('pify')
const fs = pify(require('fs'))
const home = require('user-home')
const path = require('path')
// set GNUPGHOME to default if it isn't already
if (!process.env.hasOwnProperty('GNUPGHOME')) process.env.GNUPGHOME = path.join(home, '.gnupg')

function expandConfig (lines) {
  var comments = ''
  var conf = {}
  for (var l in lines) {
    if (lines[l].length <= 1 || lines[l].startsWith('#')) comments = `${comments}${lines[l]}\n`
    else {
      var words = lines[l].split(' ')
      var cmd = words.shift()
      conf[cmd] = {
        'comments': comments,
        'args': words
      }
      comments = ''
    }
  }
  return conf
}

function flattenConfig (conf) {
  var lines = ''
  Object.keys(conf).forEach(o => {
    lines = `${lines.trim()}\n${conf[o].comments.trim()}\n${o} ${conf[o].args.join(' ')}\n`
  })
  return lines
}

async function getConfig () {
  var p = path.join(process.env.GNUPGHOME, 'gpg.conf')
  var lines = await fs.readFile(p, 'utf-8')
  return expandConfig(lines.split('\n'))
}

async function setConfig (key, vals = [], comments = '') {
  var p = path.join(process.env.GNUPGHOME, 'gpg.conf')
  var lines = await fs.readFile(p, 'utf-8')
  var re = `[#]*${key}.*[\n]+`
  lines = lines.replace(new RegExp(re), '')
  var conf = expandConfig(lines.split('\n'))
  conf[key] = {
    comments: comments,
    vals: vals
  }
  await writeConfig(conf)
}

async function writeConfig (conf) {
  var p = path.join(process.env.GNUPGHOME, 'gpg.conf')
  await fs.writeFile(flattenConfig(conf), p)
}

async function setDefaultKey (fpr) {
  var gpgconf = await getConfig()
  gpgconf['default-key'] = fpr
  await writeConfig(gpgconf)
}

async function setAgentCache (seconds) {
  var body
  if (seconds) {
    body = `default-cache-ttl ${seconds}\n`
  } else {
    body = ''
  }
  await fs.writeFile(path.join(process.env.GNUPGHOME, 'gpg-agent.conf'), body)
}

module.exports = {
  expandConfig: expandConfig,
  flattenConfig: flattenConfig,
  getConfig: getConfig,
  setConfig: setConfig,
  setDefaultKey: setDefaultKey,
  setAgentCache: setAgentCache
}
