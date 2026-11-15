"""Regression: an unconfirmed download must not discard navigation protection."""
from pathlib import Path
import json
import sys
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ENTRY = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / 'index.html'
with sync_playwright() as p:
    browser = p.chromium.launch(channel=os.environ.get('RECALLKIT_BROWSER_CHANNEL'), headless=True)
    context = browser.new_context()
    context.set_offline(True)
    page = context.new_page()
    # Model a browser/download manager declining the request without a JS exception.
    page.add_init_script('HTMLAnchorElement.prototype.click = function() {};')
    page.goto(ENTRY.as_uri())

    def warns():
        return page.evaluate("""() => {
          const e = new Event('beforeunload', {cancelable: true});
          window.dispatchEvent(e);
          return e.defaultPrevented;
        }""")

    assert not warns(), 'Fresh pack should not warn'
    page.locator('#pack-title').fill('Work without a saved copy')
    assert warns(), 'Edited pack should warn'
    page.locator('#export-json').click()
    assert warns(), 'Unconfirmed/blocked JSON download must retain navigation warning'
    pack = {'version': 1, 'title': 'Saved source', 'levels': [
        {'name': 'First', 'size': 3, 'mode': 'pattern', 'tiles': [0, 4, 8]}]}
    page.locator('#import-file').set_input_files({
        'name': 'saved.json', 'mimeType': 'application/json',
        'buffer': json.dumps(pack).encode()})
    page.get_by_text('Imported 1 levels.', exact=False).wait_for()
    assert not warns(), 'Successfully imported source already has a saved copy'
    browser.close()
print('PASS: fresh/imported state clean; blocked export retains edited-work warning')
