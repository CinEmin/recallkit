(function(){
  'use strict';
  const C=RecallKit, $=id=>document.getElementById(id);
  let pack={version:1,title:'Small moments',levels:[{name:'A simple beginning',size:3,mode:'pattern',tiles:[0,4,8]}]}, current=0, dirty=false, importGeneration=0;
  const modes={pattern:'Players recall the highlighted tiles in any order.',sequence:'Players repeat the numbered tiles in the same order.',reverse:'Players repeat the numbered tiles backwards.'};
  function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
  function changed(){dirty=true;importGeneration++;message('Unsaved changes. Save JSON to keep an editable copy.');renderPreview();}
  function renderList(){
    $('level-count').textContent=pack.levels.length+' / 50';$('level-list').replaceChildren();
    pack.levels.forEach((l,i)=>{const b=document.createElement('button');b.className='level-item'+(i===current?' active':'');b.dataset.level=i;b.setAttribute('aria-current',i===current?'true':'false');b.textContent=(i+1)+'. '+(l.name||'Untitled level');const s=document.createElement('small');s.textContent=l.size+' × '+l.size+' · '+l.mode;b.append(s);b.onclick=()=>{current=i;renderEditor();};$('level-list').append(b);});
    $('add-level').disabled=pack.levels.length>=50;$('delete-level').disabled=pack.levels.length===1;
  }
  function renderGrid(){
    const l=pack.levels[current];$('editor-grid').style.gridTemplateColumns='repeat('+l.size+', minmax(0, 1fr))';$('editor-grid').replaceChildren();
    for(let i=0;i<l.size*l.size;i++){const pos=l.tiles.indexOf(i);const b=document.createElement('button');b.type='button';b.className='tile'+(pos>=0?' selected':'');b.dataset.tile=i;b.textContent=pos>=0?String(pos+1):'·';b.setAttribute('aria-label','Tile '+(i+1));b.setAttribute('aria-pressed',String(pos>=0));b.onclick=()=>{if(pos>=0)l.tiles.splice(pos,1);else l.tiles.push(i);changed();renderGrid();$('editor-grid').children[i].focus();};$('editor-grid').append(b);}
    $('tile-count').textContent=l.tiles.length+' selected / '+l.size*l.size;
  }
  function renderEditor(){const l=pack.levels[current];$('level-name').value=l.name;$('grid-size').value=l.size;$('mode').value=l.mode;$('mode-help').textContent=modes[l.mode];renderList();renderGrid();}
  function renderPreview(){try{C.mountPlayer($('preview'),C.normalize(pack),C.matches);}catch(e){$('preview').replaceChildren();const p=document.createElement('p');p.textContent='Preview needs a valid pack: '+e.message;$('preview').append(p);}}
  function download(text,type,filename){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  $('pack-title').oninput=()=>{pack.title=$('pack-title').value;changed();};
  $('level-name').oninput=()=>{pack.levels[current].name=$('level-name').value;changed();renderList();};
  $('grid-size').onchange=()=>{const l=pack.levels[current];l.size=Number($('grid-size').value);l.tiles=l.tiles.filter(t=>t<l.size*l.size);changed();renderEditor();};
  $('mode').onchange=()=>{pack.levels[current].mode=$('mode').value;changed();renderEditor();};
  $('clear-tiles').onclick=()=>{pack.levels[current].tiles=[];changed();renderGrid();};
  $('add-level').onclick=()=>{if(pack.levels.length>=50)return;pack.levels.push({name:'Level '+(pack.levels.length+1),size:3,mode:'sequence',tiles:[0]});current=pack.levels.length-1;changed();renderEditor();};
  $('delete-level').onclick=()=>{if(pack.levels.length===1)return;pack.levels.splice(current,1);current=Math.min(current,pack.levels.length-1);changed();renderEditor();};
  $('preview-button').onclick=renderPreview;
  $('export-json').onclick=()=>{try{download(JSON.stringify(C.normalize(pack),null,2),'application/json','recallkit-pack.json');dirty=false;message('JSON download started. Keep that file to edit this pack later.');}catch(e){message(e.message,true);}};
  $('export-html').onclick=()=>{try{download(C.exportHTML(pack),'text/html','recallkit-play.html');message('Playable HTML download started. Open it offline, or share the file. Save JSON too if you want to edit later.');}catch(e){message(e.message,true);}};
  $('import-button').onclick=()=>$('import-file').click();
  $('import-file').onchange=async()=>{const file=$('import-file').files[0];$('import-file').value='';if(!file)return;const generation=++importGeneration;try{if(file.size>65536)throw new Error('Import must be no larger than 64 KiB.');const next=C.parse(await file.text());if(generation!==importGeneration){message('Import cancelled because the pack changed. Try importing again.',true);return;}pack=next;current=0;dirty=false;$('pack-title').value=pack.title;renderEditor();renderPreview();message('Imported '+pack.levels.length+' levels. Save JSON after making changes.');}catch(e){message('Import failed: '+e.message+' Your current pack was kept.',true);}};
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  renderEditor();renderPreview();
})();
