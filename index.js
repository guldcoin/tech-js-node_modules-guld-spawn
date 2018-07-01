const child_process = require('child_process') // eslint-disable-line camelcase

module.exports = async function spawn (command, stdin, args = [], redirectErr = false) {
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
    proc.stdin.end(stdin)
  })
}
