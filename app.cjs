const path = require('path');
const port = process.env.PORT || '3002';
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
require('child_process').execSync(nextBin + ' start -p ' + port + ' -H 0.0.0.0', {
  stdio: 'inherit',
  cwd: __dirname
});
