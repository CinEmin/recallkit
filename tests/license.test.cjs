const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../core.js');

test('MIT notice travels with standalone player and editor source', () => {
  const license = fs.readFileSync(path.join(__dirname, '../LICENSE'), 'utf8').replace(/\r\n/g, '\n').trim();
  const pack = {version:1,title:'Creator content',levels:[{name:'One',size:2,mode:'pattern',tiles:[0]}]};
  const html = C.exportHTML(pack);
  assert.ok(html.includes('<!--\n' + license + '\n-->'), 'Export must carry the complete license notice');
  const index = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8').replace(/\r\n/g, '\n');
  assert.ok(index.includes('<!--\n' + license + '\n-->'), 'Editor must carry the complete license notice');
  assert.ok(html.includes('Creator content'), 'User content must remain unchanged');
});
