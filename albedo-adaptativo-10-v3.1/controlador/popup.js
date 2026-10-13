const toggle = document.querySelector('#enabled');
const refresh = document.querySelector('#refresh');
async function render() {
  const data = await chrome.runtime.sendMessage({type:'status'});
  if(data.error) throw new Error(data.error);
  toggle.checked=data.enabled;
  document.querySelector('#status').textContent=data.status?.message || 'Aguardando verificação.';
  const calibrations=data.config.sets.map(set=>`${set.width}px ± ${set.tolerance}`).join(' · ');
  document.querySelector('#scope').textContent=`1–${data.config.maxTabs} abas · ${calibrations}${data.status?.width ? ` · janela atual ${data.status.width}px` : ''}`;
  const list=document.querySelector('#themes');
  list.replaceChildren();
  const themes=data.config.sets.flatMap(set=>set.themes.map(theme=>({...theme,width:set.width})));
  for(const theme of [...themes,data.config.base]) {
    const item=data.installed.find(x=>x.id===theme.id);
    const row=document.createElement('li');
    const label=document.createElement('span');
    label.textContent=theme.count ? `${theme.count} ${theme.count===1?'aba':'abas'} · ${theme.width}px` : 'Base sem retrato';
    const state=document.createElement('span');
    state.textContent=item ? item.enabled?'Ativo':'Instalado' : 'Falta carregar';
    state.className=item?'present':'missing';
    row.append(label,state);list.append(row);
  }
}
function failed(error){document.querySelector('#status').textContent=error.message;}
toggle.addEventListener('change',async()=>{
  toggle.disabled=true;
  try {await chrome.runtime.sendMessage({type:'enabled',value:toggle.checked});await render();}
  catch(error){failed(error);}finally{toggle.disabled=false;}
});
refresh.addEventListener('click',async()=>{
  refresh.disabled=true;
  try {await chrome.runtime.sendMessage({type:'refresh'});await render();}
  catch(error){failed(error);}finally{refresh.disabled=false;}
});
chrome.storage.onChanged.addListener(()=>render().catch(failed));
render().catch(failed);
