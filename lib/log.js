const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const logdir = path.join(os.homedir(), '.local/share/mimejs');
const logfile = path.join(logdir, 'mimejs.log');

const write = async (tag, msg) => {
  await fs.promises.mkdir(logdir, { recursive: true });
  await fs.promises.appendFile(logfile, `[${(new Date()).toISOString()}][${tag}]: ${msg}\n`);
};

module.exports = {
  write
};
