# RecallKit — offline authoring prototype

[Download free on itch.io](https://cinemin.itch.io/recallkit) · [GitHub release mirror](https://github.com/CinEmin/recallkit/releases/tag/v0.1.1-mit) · [Report a playtest](https://github.com/CinEmin/recallkit/issues/new?template=playtest.yml)

![RecallKit editor showing two custom levels and a playable preview](assets/editor-preview.png)

<details>
<summary>Watch the 22-second authoring walkthrough</summary>

![Actual editor steps: choose tiles, add a reverse level, save JSON, export HTML, and play the exported file](assets/authoring-demo.gif)

An edited sequence of actual prototype screenshots, not real-time task duration. Two levels are created; the exported player is opened offline. [Read the step-by-step guide](docs/create-memory-activity.md) for a text alternative.

</details>

A dependency-free visual editor for small memory-pattern activities. No network, account, analytics, payments, storage requirement, or efficacy claims. Product name is provisional. Paid demand has not been validated.

Open `index.html` directly in a modern browser. All editor files must stay together. Alternatively serve this directory locally with `python -m http.server 8766 --bind 127.0.0.1` and open `http://127.0.0.1:8766/`.

1. Name your pack. Edit, add, or delete levels; at least one level must remain.
2. Choose a 2–6 square grid and pattern, sequence, or reverse recall mode.
3. Click tiles to add them in order. Click selected tiles to remove them. Reducing grid size drops indices outside the new grid.
4. Preview the pack: **Show pattern**, study it, then **Hide & recall**. Reveal time is deliberately self-paced. A wrong response allows unlimited retries.
5. **Save JSON** downloads the editable source. After edits, the close-tab warning remains even after requesting a download: the browser does not confirm to this page that a file was saved. Check your downloaded file before leaving. Work is held only in this tab; closing or reloading can lose unsaved work. **Import JSON** replaces the current pack only when validation succeeds.
6. **Download playable HTML** creates one standalone file, including styles, data, and player. Open or share that file; it needs no companion assets or connection. Keep JSON separately for editing.

JSON schema: `{ "version": 1, "title": "My pack", "levels": [{ "name": "First", "size": 3, "mode": "sequence", "tiles": [0,4,8] }] }`. Tile indices are zero-based, row-major, ordered and unique. Titles/names must contain 1–80 characters, with non-whitespace content. 1–50 levels; each needs at least one tile. Imports are limited to 64 KiB UTF-8; unknown fields are discarded. Invalid imports preserve the current pack. Edits reset preview immediately; there are no delayed reveal callbacks.

From the source repository directory, run `node --test tests/*.test.cjs`. Tests are included in the source repository, not the smaller end-user ZIP. Browser acceptance is a separate check, not claimed by the Node suite.

Stable browser selectors: `#pack-title`, `#level-name`, `#grid-size`, `#mode`, `#editor-grid [data-tile="0"]`, `#add-level`, `#delete-level`, `#level-list [data-level="0"]`, `#clear-tiles`, `#import-file`, `#export-json`, `#export-html`, `#message`. Preview: `#preview #player-action`, `#preview #player-grid [data-tile="0"]`. Exported player: `#player-action`, `#player-grid [data-tile="0"]`, `[role="status"]`.

Core API: `RecallKit.normalize(pack)`, `parse(jsonText)`, `matches(level, indices)`, `serialize(pack)`, `exportHTML(pack)`, and `mountPlayer(container, pack, matches)`; CommonJS exports provide the same API for Node tests. No build step or external dependencies.

Verified in Microsoft Edge on Windows at1440px and390px: authoring, JSON roundtrip, failed import preservation, standalone offline play/retry, inert script-like titles and no HTTP(S) requests. Other browsers, physical touch devices and target-customer usability are not yet verified. This is a free evaluation prototype, not a finished paid product or a proven business.

## Try a finished example first

Running the sample with a group? Use the [facilitator guide](docs/facilitator-guide.md) for self-paced instructions, local-device setup and adapting the editable pack.

[Play the three-activity sample in your browser](https://cinemin.itch.io/recallkit) with **Run tool**, then follow the [step-by-step authoring guide](docs/create-memory-activity.md) to recreate it in the offline editor. The embedded sample does not edit packs.

[Download the standalone example HTML](https://github.com/CinEmin/recallkit/releases/download/v0.1.1-mit/recallkit-example.html), then open the downloaded file in your browser. No ZIP extraction or editor setup is needed. It contains three short activities: pattern, sequence and reverse recall. This is a player sample, not the editor; use the single-file editor below to create your own levels. The browser may download the HTML rather than display it immediately.

## Open the editor without extracting a ZIP

The [itch.io download page](https://cinemin.itch.io/recallkit) offers the editor, playable example and source ZIP free, with no payment or donation step. Choose `recallkit-editor.html` to start creating.

[Download the single-file editor](https://github.com/CinEmin/recallkit/releases/download/v0.1.1-mit/recallkit-editor.html) and open the downloaded HTML in your browser. It includes the same editor code and styles; no companion files are needed. Save JSON before closing or reloading. This alternative was tested offline in Edge on Windows, including JSON import/export and playable HTML export. The ZIP remains available below for source files and examples.

## Try the prototype

Download the ZIP from [Releases](https://github.com/CinEmin/recallkit/releases), extract it, and open `index.html`. Create two levels of your own, save the JSON, export playable HTML, then open the exported file in another browser tab. The `samples` folder contains an example editable pack and its standalone player.

If you choose to give feedback, [open a playtest report](https://github.com/CinEmin/recallkit/issues/new?template=playtest.yml). Reports are public: do not include personal information, credentials, proprietary content or private files. Tell us whether you completed the task without assistance, where you got stuck, and which tool you would otherwise use. Download counts are not measured usability or purchase intent.

Code and interface text were created with AI assistance. No third-party code, images or audio assets are bundled. The prototype has no checkout, subscription or promised future feature set.

## Who this experiment is for

Independent creators who want to make a short, custom memory-pattern activity without changing source code. Create a grid, pick tiles in order, choose the recall rule, then export a file someone else can open. It does not generate a full game campaign, collect player results or sync across devices. This experiment tests whether that small authoring workflow is useful.


## Prefer to play a ready-made activity?

[LoopLab Memory Journey](https://looplab-pilot.racing-thyme-8277.chatgpt.site/) offers 15 untimed levels directly in a browser, with free hints and retries. It is a separate game, not a viewer for RecallKit files. LoopLab has optional consent-based analytics; RecallKit's offline editor and exports have none. [LoopLab source and details](https://github.com/CinEmin/looplab).


## License for this prototype

This published RecallKit 0.1.1 prototype is available under the [MIT License](LICENSE), including its editor, bundled player runtime, documentation and examples. You may use, modify, share and sell copies under those terms; retain the license notice. The standalone editor and newly exported players carry the notice inside their HTML. This does not license your own activity text or other content to us. It does not apply to LoopLab or automatically license unreleased future products.
