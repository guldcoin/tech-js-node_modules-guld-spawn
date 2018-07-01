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
  lines = lines.replace(new RegExp(re), '').split('\n')
  var conf = expandConfig(lines)
  conf[key] = {
    comments: comments || '',
    args: vals || []
  }
  await writeConfig(conf)
}

async function writeConfig (conf) {
  var p = path.join(process.env.GNUPGHOME, 'gpg.conf')
  await fs.writeFile(p, flattenConfig(conf))
}

async function setDefaultKey (fpr) {
  await setConfig('default-key', [fpr])
}

async function setSecureDefaults () {
  await setConfig('no-greeting')
  await setConfig('no-auto-key-locate')
  await setConfig('charset', ['utf-8'])
  await setConfig('keyid-format', ['0xlong'])
  await setConfig('with-fingerprint')
  await setConfig('verbose')
  await setConfig('list-options', ['show-policy-urls', 'no-show-photos', 'show-notations', 'show-keyserver-urls', 'show-uid-validity', 'show-sig-subpackets'])
  await setConfig('disable-dsa2')
  await setConfig('verify-options', ['show-policy-urls', 'no-show-photos', 'show-notations', 'show-keyserver-urls', 'show-uid-validity', 'no-pka-lookups', 'no-pka-trust-increase'])
  await setConfig('keyserver', ['hkps://hkps.pool.sks-keyservers.net'])
  await setConfig('keyserver-options', ['check-cert', 'ca-cert-file=~/.gnupg/sks-keyservers.netCA.pem', 'keep-temp-files', 'verbose', 'verbose', 'debug', 'no-honor-keyserver-url', 'no-auto-key-retrieve', 'no-honor-pka-record'])
  await setConfig('require-cross-certification')
  await setConfig('force-v4-certs')
  await setConfig('import-options', ['no-repair-pks-subkey-bug', 'import-clean'])
  await setConfig('export-options', ['export-clean'])
  await setConfig('force-mdc')
  await setConfig('s2k-cipher-algo', ['AES256'])
  await setConfig('s2k-digest-algo', ['SHA512'])
  await setConfig('s2k-mode', [3])
  await setConfig('s2k-count', [65011712])
  await setConfig('personal-cipher-preferences', ['S9', 'S8', 'S7', 'S10', 'S4', 'S13', 'S12', 'S11'])
  await setConfig('personal-digest-preferences', ['H10', 'H9', 'H11', 'H8', 'H3', 'H2'])
  await setConfig('personal-compress-preferences', ['Z2', 'Z3', 'Z1', 'Z0'])
  await setConfig('disable-cipher-algo', ['CAST5', 'IDEA'])
  await setConfig('default-preference-list', ['S9', 'S8', 'S7', 'S10', 'S4', 'S13', 'S12', 'S11', 'H10', 'H9', 'H11', 'H8', 'H3', 'H2', 'Z2', 'Z3', 'Z1', 'Z0'])
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
  setAgentCache: setAgentCache,
  setSecureDefaults: setSecureDefaults
}
