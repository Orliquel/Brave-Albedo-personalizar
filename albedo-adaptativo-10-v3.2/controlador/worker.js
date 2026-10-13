const configPromise = fetch(chrome.runtime.getURL('config.json')).then(response => response.json());
let scheduled;
let chain = Promise.resolve();
let lastStatusSignature;
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function enqueue(task) {
  chain = chain.catch(() => {}).then(task).catch(async error => {
    await setStatus({state:'error',message:error.message});
  });
  return chain;
}

async function setStatus(status) {
  const signature = JSON.stringify(status);
  if (signature === lastStatusSignature) return;
  await chrome.storage.local.set({status:{...status,updatedAt:Date.now()}});
  const success = status.state === 'active';
  await chrome.action.setBadgeText({text:success ? String(status.count) : status.state === 'base' ? '–' : '!'});
  await chrome.action.setBadgeBackgroundColor({color:success ? '#70192c' : '#45404a'});
  lastStatusSignature = signature;
}

function themeDefinitions(config) {
  return config.sets.flatMap(set => set.themes.map(theme => ({...theme, calibratedWidth:set.width})));
}

function schedule() {
  clearTimeout(scheduled);
  scheduled = setTimeout(() => enqueue(reconcile), 650);
}

async function ownedItems() {
  const config = await configPromise;
  const definitions = [...themeDefinitions(config),config.base];
  const installed = await chrome.management.getAll();
  return {config,definitions,installed,owned:installed.filter(item => item.type === 'theme' && definitions.some(theme=>theme.id===item.id))};
}

async function reconcile() {
  const {config,definitions,owned} = await ownedItems();
  const saved = await chrome.storage.local.get({enabled:true,appliedId:null});
  const missing = definitions.filter(theme=>!owned.some(item=>item.id===theme.id));
  if(missing.length) {
    await setStatus({state:'missing',message:`Carregue ${missing.length} pasta(s) de temas.`,missing:missing.map(x=>x.directory)});
    return;
  }
  if(!saved.enabled) {
    await setStatus({state:'paused',message:'Troca automática pausada.'});
    return;
  }
  const window = await chrome.windows.getLastFocused({populate:true,windowTypes:['normal']});
  if(!window || window.incognito || window.type!=='normal') return;
  const tabs = window.tabs || [];
  const count = tabs.length;
  let reason = '';
  if(count<1 || count>config.maxTabs) reason = `Quantidade fora do escopo de 1 a ${config.maxTabs} abas.`;
  else if(tabs.some(tab=>tab.pinned || tab.groupId!==-1 || tab.splitViewId>0)) reason = 'Abas fixadas, grupos ou divisão exigem outra calibração.';
  const calibration = config.sets.find(set => Math.abs(window.width-set.width)<=set.tolerance);
  if(!reason && !calibration) reason = `Largura de ${window.width}px fora das larguras calibradas (${config.sets.map(set=>set.width).join(' e ')}px).`;
  const desired = reason ? config.base : calibration.themes.find(theme=>theme.count===count);
  const enabled = owned.filter(item=>item.enabled);
  if(saved.appliedId!==desired.id || enabled.length!==1 || enabled[0].id!==desired.id) {
    // A desativação pela extensão protege as variantes contra a limpeza de temas do Chromium.
    for(const item of enabled) await chrome.management.setEnabled(item.id,false);
    await chrome.management.setEnabled(desired.id,true);
    await wait(150);
    const check = await chrome.management.get(desired.id);
    if(!check.enabled) throw new Error('O Brave não ativou a variante selecionada.');
    await chrome.storage.local.set({appliedId:desired.id});
  }
  await setStatus({state:reason?'base':'active',count,windowId:window.id,width:window.width,
    calibratedWidth:calibration?.width,themeId:desired.id,
    message:reason || `Tema para ${count} ${count===1?'aba':'abas'} · ${calibration.width}px ativo.`});
}

chrome.tabs.onCreated.addListener(schedule);
chrome.tabs.onRemoved.addListener(schedule);
chrome.tabs.onMoved.addListener(schedule);
chrome.tabs.onAttached.addListener(schedule);
chrome.tabs.onDetached.addListener(schedule);
chrome.tabs.onUpdated.addListener((_id,changes)=>{
  if('pinned' in changes || 'groupId' in changes || 'splitViewId' in changes) schedule();
});
chrome.windows.onFocusChanged.addListener(id=>{if(id!==chrome.windows.WINDOW_ID_NONE) schedule();});
chrome.windows.onBoundsChanged.addListener(schedule);
chrome.runtime.onStartup.addListener(schedule);
chrome.runtime.onInstalled.addListener(schedule);
chrome.management.onEnabled.addListener(schedule);
chrome.management.onDisabled.addListener(schedule);
chrome.management.onUninstalled.addListener(schedule);
chrome.management.onInstalled.addListener(async item=>{
  try {
  const config = await configPromise;
  if(item.type==='theme' && [...themeDefinitions(config),config.base].some(theme=>theme.id===item.id)) {
    await chrome.management.setEnabled(item.id,false);
    await chrome.storage.local.remove('appliedId');
  }
  schedule();
  } catch(error) { await setStatus({state:'error',message:error.message}); }
});
chrome.runtime.onMessage.addListener((message,_sender,respond)=>{
  if(message?.type==='status') {
    Promise.all([chrome.storage.local.get({enabled:true,status:null}),ownedItems()])
      .then(([saved,items])=>respond({...saved,config:items.config,installed:items.owned.map(x=>({id:x.id,name:x.name,enabled:x.enabled}))}))
      .catch(error=>respond({error:error.message}));
    return true;
  }
  if(message?.type==='enabled' && typeof message.value==='boolean') {
    enqueue(async()=>{await chrome.storage.local.set({enabled:message.value});await reconcile();})
      .then(()=>respond({ok:true}));
    return true;
  }
  if(message?.type==='refresh') {
    enqueue(reconcile).then(()=>respond({ok:true}));
    return true;
  }
});
schedule();
