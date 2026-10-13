import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const playwrightPath = process.env.ALBEDO_PLAYWRIGHT_MODULE;
if (!playwrightPath) throw new Error('Playwright não foi localizado. Execute TESTAR-3.3.cmd.');
const {chromium} = require(playwrightPath);
const config = await (await import('node:fs/promises')).readFile(path.join(root, 'controlador/config.json'), 'utf8').then(JSON.parse);
const brave = process.env.ALBEDO_BRAVE_EXE;
const profile = process.env.ALBEDO_TEST_PROFILE;
if (!brave || !profile) throw new Error('O lançador não informou o Brave ou o perfil temporário.');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const extensionDirs = [
  'controlador',
  ...config.sets.flatMap(set => set.themes.map(theme => theme.directory)),
  config.base.directory,
];
const context = await chromium.launchPersistentContext(profile, {
  executablePath: brave,
  headless: false,
  viewport: null,
  ignoreDefaultArgs: ['--disable-extensions', '--disable-component-extensions-with-background-pages'],
  args: [
    '--enable-unsafe-extension-debugging',
    '--disable-sync',
    '--disable-background-networking',
    '--disable-component-update',
    '--no-first-run',
    '--no-default-browser-check',
    '--force-device-scale-factor=1',
    '--start-maximized',
  ],
});

try {
  const browser = context.browser();
  const cdp = await browser.newBrowserCDPSession();
  for (const directory of extensionDirs) {
    await cdp.send('Extensions.loadUnpacked', {path: path.join(root, directory)});
    await wait(700);
  }

  const pages = context.pages();
  for (let index = 0; index < 5; index++) {
    const page = index === 0 ? pages[0] : await context.newPage();
    await page.goto(`data:text/html,<title>Aba ${index + 1}</title><body style="background:%230c0b0d;color:%23eee;font:16px sans-serif;padding:24px">Albedo Adaptativo 3.3 — aba ${index + 1}</body>`);
  }
  await context.pages()[0].bringToFront();

  const worker = context.serviceWorkers().find(item => item.url().includes('ghodeedgpoghknphklhnpmeddencbejh'));
  let status = 'controlador carregado';
  if (worker) {
    const value = await worker.evaluate(async () => (await chrome.storage.local.get('status')).status);
    status = value?.state === 'active' ? `controlador ativo · ${value.count} abas · ${value.width}px` : `controlador · ${value?.state ?? 'inicializando'}`;
  }
  console.log(`Teste 3.3 aberto. ${status}. Perfil isolado: ${profile}`);
  console.log('Ajuste a janela e adicione/feche abas para conferir a troca. Feche o Brave para encerrar.');
  await new Promise(resolve => context.once('close', resolve));
} finally {
  if (context.browser()?.isConnected()) await context.close();
}
