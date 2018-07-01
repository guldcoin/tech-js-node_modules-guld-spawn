/* global describe:false it:false */
const assert = require('chai').assert
const { expandConfig, flattenConfig } = require('./index.js')
const pify = require('pify')
const path = require('path')
const fs = pify(require('fs'))
const _isEqual = require('lodash.isequal')
process.env.GNUPGHOME = path.resolve('fixtures')

describe('gpg-conf', function () {
  it('expandConfig', async () => {
    this.confile = await fs.readFile('./fixtures/gpg.conf', 'utf-8')
    this.conf = expandConfig(this.confile.split('\n'))
    assert.exists(this.conf)
    assert.exists(this.conf['no-greeting'])
    assert.exists(this.conf['no-auto-key-locate'])
    assert.equal(this.conf['no-auto-key-locate'].comments, '# Don\'t leak information by automatically trying to get keys.\n')
    assert.isTrue(_isEqual(['S9', 'S8', 'S7', 'S10', 'S4', 'S13', 'S12', 'S11'], this.conf['personal-cipher-preferences'].args))
  })
  it('flattenConfig', async () => {
    var flat = flattenConfig(this.conf)
    assert.exists(flat)
    assert.equal(this.confile, flat)
  })
  /* it('isLocked', async () => {
    var islocked = await gpg.isLocked(fpr)
    assert.isNotTrue(islocked)
  }).timeout(15000)
  it('lock', async () => {
    await gpg.lockKey(fpr, 'password')
    var islocked = await gpg.isLocked(fpr)
    assert.isTrue(islocked)
  })
  it('unlock', async () => {
    await gpg.unlockKey(fpr, 'password')
    var islocked = await gpg.isLocked(fpr)
    assert.exists(islocked)
    assert.isNotTrue(islocked)
  }).timeout(15000) */
})
