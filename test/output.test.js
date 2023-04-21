/**
 * @file This test checks that the output is as expected. It includes the src file.
 */
const fs = require('fs');
const path = require('path');

describe('yaml-inject.js', () => {
  const main = path.resolve(__dirname,'main.yaml');
  const partials = path.resolve(__dirname,'**','*.partial.yaml');
  const output = path.resolve(__dirname,'output.yaml');
  const property = 'players';
  const args = { main, partials, output, property };

  beforeEach(() => {
    // Delete output file before each test
    if (fs.existsSync(output))
      fs.unlinkSync(output);
  });

  test('check requiring file, merging YAML files, and outputing to file', () => {
    // Require the script
    const index = path.resolve(__dirname, '..', 'src', 'index');
    const yamlInject = require(index);

    // Run the function
    yamlInject(args);

    // Check that output file was created
    expect(fs.existsSync(output)).toBe(true);

    // Read output file and check its content
    const outputContent = fs.readFileSync(output, 'utf8');
    const expectedContent = `title: Team
${property}:
  bob:
    name: Bob
  steve:
    name: Steve
    age: 15
description: This is a soccer team.
`;

    expect(outputContent).toEqual(expectedContent);
  });
});
