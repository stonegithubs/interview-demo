import * as shell from 'shelljs';

const files = [
  '.env',
  '.env.dev',
  '.env.prod',
  'ormconfig.js',
  'views',
  'public',
  'logs',
];

files.forEach(f => {
  if (shell.test('-f', f)) {
    shell.cp('-R', f, 'dist/');
  }

  if (shell.test('-d', f)) {
    shell.cp('-R', f, 'dist/');
  }
});
