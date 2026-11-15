# Create an offline memory-pattern activity with RecallKit

Make three small levels, keep an editable copy, and export one HTML file for someone else to play. This walkthrough recreates the included **Three quiet challenges** sample. RecallKit is a free prototype, not a complete game engine; no educational or health outcome is promised.

[Play the finished example in your browser](https://cinemin.itch.io/recallkit) by choosing **Run tool**. That embedded example is a player, not an editor.

## Open the editor

Download `recallkit-editor.html` from the [same itch.io page](https://cinemin.itch.io/recallkit), then open it in a modern browser. The downloaded editor works offline. Edge on Windows is the tested environment; physical mobile devices and other browsers are not verified.

If you prefer the source ZIP, extract it, keep the files together and open `index.html`. The ZIP includes `samples/example.json`, which you can import to inspect the finished editable pack. Save your existing work before importing another pack.

## Build the three levels

Set **Pack title** to `Three quiet challenges`. For each level below, set **Grid size** to **3 × 3** and click **Clear tiles** before choosing the listed cells. New levels have a selected tile by default, so clearing first matters.

Read the grid positions from left to right, top to bottom:

```text
1  2  3
4  5  6
7  8  9
```

| Level name | Recall mode | Click these cells in this order | Player's answer |
| --- | --- | --- | --- |
| Corners | Pattern · any order | 1, 3, 7, 9 | The four corners, in any order |
| Across the grid | Sequence · same order | 1, 5, 9 | 1, 5, 9 |
| Think backwards | Reverse · backwards | 2, 5, 8 | 8, 5, 2 |

Rename the initial level to **Corners**. Use **+ Add level** for the second and third rows. Set the name, mode and selected cells separately for each level. The numbers drawn inside selected tiles show selection order, not grid position.

## Try the whole pack

Choose **Restart preview** to start at the beginning. Click **Show pattern**, study the tiles, then **Hide & recall**. Select the answer cells. After a correct answer, use **Next level**. Complete the last level and choose **Finish pack**; the player should say **Pack complete. Well played!**

The reveal is self-paced. A wrong answer can be retried; no timer or payment is required.

## Keep an editable copy and share a playable file

1. Choose **Save JSON**. Check that `recallkit-pack.json` actually appears in your downloads. This is your editable source.
2. Choose **Download playable HTML**. Check for `recallkit-play.html` and open it in a separate browser tab.
3. Test the exported pack before sharing the HTML file. It contains its own styles and player; recipients need no companion files. Share the JSON too only if you want them to edit the pack.

The editor does not autosave. Keep JSON before closing or reloading. An on-screen download message is not proof that the browser saved the file: check your downloads. If your browser blocks a download, keep the editor tab open and resolve its download prompt before leaving.

## If you bundle several files into a ZIP

A playable RecallKit HTML file works by itself; a ZIP is optional. When sharing HTML together with editable JSON and instructions:

1. Put only the intended files in a new delivery folder. Keep private notes and unrelated exports out.
2. Add a short README telling recipients which HTML to open and whether the JSON is included for editing. Retain the runtime license notice already embedded in the HTML.
3. Create the ZIP, open a fresh copy of its contents, and play the exported activity. A valid ZIP alone does not prove that the activity works.
4. If you already use Python, the separate free [Delivery Preflight prototype](https://cinemin.itch.io/delivery-preflight) can check required files, packaging clutter and ZIP integrity locally. It requires Python 3.10+ and does not upload archive contents. It is optional, is not malware scanning, and has its own terms; RecallKit's MIT license does not apply to that tool.

## What stays local

The downloaded editor and exported player do not send analytics or player results. They do not sync devices, collect scores or import LoopLab progress. The itch.io hosting page uses its own platform services; it is separate from the offline files.

## Tell us where you got stuck

An optional [public playtest report](https://github.com/CinEmin/recallkit/issues/new?template=playtest.yml) helps evaluate the workflow. Say whether you used this guide or worked unaided, which step failed, and what you would normally use instead. Guided completion is not an unaided test result. Do not include personal information or private files. No reward or payment is offered.
