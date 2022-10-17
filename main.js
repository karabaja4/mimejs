#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2));
const path = require('path');
const util = require('util');
const nanomatch = require('nanomatch');
const exec = util.promisify(require('child_process').exec);
const log = require('./lib/log');
const cfg = require('./lib/config');

if (args.help || args._.length !== 1 || !args._[0]) {
  console.log('mimejs\n\nusage: xdg-open { file | URL }');
  process.exit(1);
}

const main = async () => {

  const fatal = async (msg) => {
    await log.write('error', msg);
    console.error(msg);
    return process.exit(1);
  };
  
  const esc = (value) => {
    return value.replace(/'/g, "'\\''");
  };
  
  const arg = esc(args._[0]);
  
  const vars = {
    '$arg': `'${arg}'`
  };
  
  const sub = (cmd) => {
    for (const key in vars) {
      cmd = cmd.replace(key, () => vars[key]);
    }
    return cmd;
  };
  
  const execute = async (source, cmd) => {
    const command = sub(cmd);
    await log.write(source, command);
    return await exec(`( ${command} & ) > /dev/null 2>&1`);
  };

  const config = await cfg.read();
  if (!config) {
    return await fatal('Config file not found or not readable');
  }

  // protocols
  if (arg.match(/^[a-z]+:\/l?\/.+$/gi)) { // l? is for msteams support
    const protocols = config['protocols'] || {};
    for (const key in protocols) {
      if (key.match(/^[a-z]+:\/l?\/.*$/gi)) {
        if (arg.startsWith(key)) {
          return await execute(`protocol:${key}`, protocols[key]);
        }
      }
    }
  }

  // extensions
  const ext = path.extname(arg).replace('.', '');
  if (ext) {
    const extensions = config['extensions'] || {};
    for (const key in extensions) {
      const splits = key.split(',');
      for (let i = 0; i < splits.length; i++) {
        if (ext === splits[i].trim()) {
          return await execute(`extension:${ext}`, extensions[key]);
        }
      }
    }
  }

  const match = (value, glob) => {
    return nanomatch.isMatch(value, glob.replace(/\*+/gi, '**'), { nonegate: true, nocase: true });
  };

  // mimetypes
  try {
    const mimetypes = config['mimetypes'] || {};
    const { stdout } = await exec(`file -L -E --brief --mime-type '${arg}'`);
    for (const key in mimetypes) {
      if (match(stdout.trim(), key)) {
        return await execute(`mimetype:${key}`, mimetypes[key]);
      }
    }
  } catch (e) {}

  return await fatal(`No suitable command: ${arg}`);
}

main();
