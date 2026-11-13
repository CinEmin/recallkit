(function (root) {
  'use strict';
  function normalize(value) {
    const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    const label = (v, field) => { if (typeof v !== 'string' || !v.trim() || v.length > 80) throw new Error(field + ' must contain 1–80 characters.'); return v; };
    if (!object(value) || value.version !== 1) throw new Error('Expected a version 1 RecallKit pack.');
    const title = label(value.title, 'Pack title');
    if (!Array.isArray(value.levels) || value.levels.length < 1 || value.levels.length > 50) throw new Error('A pack needs 1–50 levels.');
    const levels = value.levels.map((v, i) => {
      if (!object(v)) throw new Error('Invalid level ' + (i + 1));
      const name = label(v.name, 'Level ' + (i + 1) + ' name');
      if (!Number.isInteger(v.size) || v.size < 2 || v.size > 6) throw new Error('Grid size must be an integer from 2 to 6.');
      if (!['pattern','sequence','reverse'].includes(v.mode)) throw new Error('Choose pattern, sequence, or reverse mode.');
      if (!Array.isArray(v.tiles) || !v.tiles.length || v.tiles.length > v.size * v.size || new Set(v.tiles).size !== v.tiles.length || v.tiles.some(t => !Number.isInteger(t) || t < 0 || t >= v.size*v.size)) throw new Error('Level ' + (i + 1) + ' needs unique tiles within its grid.');
      return {name,size:v.size,mode:v.mode,tiles:v.tiles.slice()};
    });
    return {version:1,title,levels};
  }
  function parse(text) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > 65536) throw new Error('Import must be no larger than 64 KiB.');
    let value; try { value = JSON.parse(text); } catch (_) { throw new Error('This file is not valid JSON.'); }
    return normalize(value);
  }
  function matches(level, input) {
    if (input.length !== level.tiles.length || new Set(input).size !== input.length) return false;
    const expected = level.mode === 'reverse' ? level.tiles.slice().reverse() : level.tiles;
    return level.mode === 'pattern' ? input.every(t => expected.includes(t)) : input.every((t,i) => t === expected[i]);
  }
  function serialize(pack) {
    return JSON.stringify(normalize(pack)).replace(/[<>&\u2028\u2029]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0'));
  }
  // This function is also embedded verbatim in exported files. Keep it dependency-free.
  function mountPlayer(host, pack, match) {
    let index=0, phase='ready', entered=[];
    const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
    host.replaceChildren();
    const title=el('h1',pack.title), progress=el('p','','eyebrow'), name=el('h2'), instructions=el('p'), status=el('p'), grid=el('div','','play-grid'), action=el('button','Show pattern','primary');
    status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); action.id='player-action';grid.id='player-grid';
    host.append(title,progress,name,instructions,status,grid,action);
    function render(){
      const l=pack.levels[index];progress.textContent='LEVEL '+(index+1)+' / '+pack.levels.length;name.textContent=l.name;
      instructions.textContent=l.mode==='pattern'?'Remember the highlighted tiles. Choose them in any order.':l.mode==='sequence'?'Remember the numbered tiles. Repeat their order.':'Remember the numbered tiles. Repeat in reverse order.';
      grid.style.gridTemplateColumns='repeat('+l.size+', minmax(0, 1fr))';grid.replaceChildren();
      for(let i=0;i<l.size*l.size;i++){
        const revealed=phase==='reveal' && l.tiles.includes(i);const selected=entered.includes(i);
        const b=el('button',revealed ? String(l.tiles.indexOf(i)+1) : selected ? String(entered.indexOf(i)+1) : '·','tile'+(revealed||selected?' selected':''));
        b.type='button';b.dataset.tile=i;b.setAttribute('aria-label','Tile '+(i+1)+(revealed?', position '+(l.tiles.indexOf(i)+1):''));b.disabled=phase!=='input'||selected;
        b.onclick=()=>{entered.push(i);if(entered.length===l.tiles.length){phase=match(l,entered)?'success':'wrong';status.textContent=phase==='success'?'Nicely recalled!': 'Not quite. Reveal the pattern and try again.';}else status.textContent=entered.length+' / '+l.tiles.length+' tiles chosen';render();const available=Array.from(grid.querySelectorAll('button:not(:disabled)'));const target=phase==='input'?(available.find(tile=>Number(tile.dataset.tile)>i)||available[0]):action;if(target)target.focus();};grid.append(b);
      }
      action.textContent=phase==='ready'?'Show pattern':phase==='reveal'?'Hide & recall':phase==='input'?'Start again':phase==='wrong'?'Retry level':index===pack.levels.length-1?'Finish pack':'Next level';
    }
    action.onclick=()=>{
      if(phase==='success' && index===pack.levels.length-1){phase='done';grid.replaceChildren();status.textContent='Pack complete. Well played!';action.textContent='Play again';return;}
      if(phase==='done'){index=0;phase='ready';entered=[];status.textContent='Ready for another round.';}
      else if(phase==='success'){index++;phase='ready';entered=[];status.textContent='Ready when you are.';}
      else if(phase==='reveal'){phase='input';entered=[];status.textContent='Your turn. Choose '+pack.levels[index].tiles.length+' tiles.';}
      else {phase='reveal';entered=[];status.textContent='Take your time. Hide the pattern when you are ready.';}
      render();
    };
    status.textContent='Ready when you are.';render();
    return ()=>host.replaceChildren();
  }
  const playerCSS='*{box-sizing:border-box}body{margin:0;background:#f3f1ea;color:#183b34;font:16px system-ui,sans-serif}main{max-width:560px;margin:40px auto;padding:24px}h1,h2,p{overflow-wrap:anywhere}h1{font-size:30px}h2{font-size:23px}.eyebrow{letter-spacing:.12em;font-size:12px}.play-grid{display:grid;gap:8px;margin:24px 0}.tile{aspect-ratio:1;border:1px solid #b8c8bf;border-radius:12px;background:#e3ebe5;color:#1d4c3e;font-size:20px;min-width:0;padding:0}.tile.selected{background:#1d5946;color:white}.tile:disabled{opacity:1}button{cursor:pointer;font:inherit;min-height:44px}button:focus-visible{outline:3px solid #c57d21;outline-offset:3px}.primary{background:#1d5946;color:white;border:0;padding:13px 22px;border-radius:10px}';
  function exportHTML(pack) {
    return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RecallKit activity</title><style>'+playerCSS+'</style></head><body><main id="player"></main><script type="application/json" id="pack-data">'+serialize(pack)+'</script><script>('+mountPlayer.toString()+')(document.getElementById("player"),JSON.parse(document.getElementById("pack-data").textContent),'+matches.toString()+');</script></body></html>';
  }
  const api={normalize,parse,matches,serialize,exportHTML,mountPlayer};
  if(typeof module!=='undefined' && module.exports)module.exports=api;else root.RecallKit=api;
})(typeof globalThis!=='undefined'?globalThis:this);
