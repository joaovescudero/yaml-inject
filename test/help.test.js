/**
 * @file This test checks that the help can be output when calling from cli
 */
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

describe('yaml-inject.js', () => {
  test('check that bin file works and that help message displays with -h flag', () => {
    // Run the script with -h flag
    const bin = path.resolve(__dirname, '..', 'bin', 'yaml-inject');
    if(!fs.existsSync(bin))
      throw new Error("It seems the bin file doesn't exist: "+bin);

    const helpMessage = cp.execSync(`node ${bin} -h`).toString('utf8');

    // Check that help message was displayed
    expect(helpMessage).toMatch(/node yaml-inject ARGS/);
  });
});
