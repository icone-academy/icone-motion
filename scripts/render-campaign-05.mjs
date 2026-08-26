import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(projectRoot, 'out', 'campaign-05');
const includeClean = process.argv.includes('--include-clean');
const onlyAds = process.argv.includes('--only-ads');
const dryRun = process.argv.includes('--dry-run');
const remotionCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const masters = [
  ['Campaign05MasterHorizontal75s', 'icone-campaign-05-master-horizontal.mp4', 'master', 'a'],
  ['Campaign05MasterVertical75s', 'icone-campaign-05-master-vertical.mp4', 'master', 'a'],
  ['Campaign05MasterSquare75s', 'icone-campaign-05-master-square.mp4', 'master', 'a'],
];

const ads = [
  ['Campaign05GelateriaHorizontal24s', 'icone-campaign-05-gelateria-horizontal-a.mp4', 'gelateria', 'a'],
  ['Campaign05GelateriaVertical24s', 'icone-campaign-05-gelateria-vertical-a.mp4', 'gelateria', 'a'],
  ['Campaign05GelateriaVertical24sHookB', 'icone-campaign-05-gelateria-vertical-b.mp4', 'gelateria', 'b'],
  ['Campaign05GelateriaSquare24s', 'icone-campaign-05-gelateria-square-a.mp4', 'gelateria', 'a'],
  ['Campaign05EspecialistaHorizontal24s', 'icone-campaign-05-especialista-horizontal-a.mp4', 'especialista', 'a'],
  ['Campaign05EspecialistaVertical24s', 'icone-campaign-05-especialista-vertical-a.mp4', 'especialista', 'a'],
  ['Campaign05EspecialistaVertical24sHookB', 'icone-campaign-05-especialista-vertical-b.mp4', 'especialista', 'b'],
  ['Campaign05EspecialistaSquare24s', 'icone-campaign-05-especialista-square-a.mp4', 'especialista', 'a'],
  ['Campaign05IndustriaHorizontal24s', 'icone-campaign-05-industria-horizontal-a.mp4', 'industria', 'a'],
  ['Campaign05IndustriaVertical24s', 'icone-campaign-05-industria-vertical-a.mp4', 'industria', 'a'],
  ['Campaign05IndustriaVertical24sHookB', 'icone-campaign-05-industria-vertical-b.mp4', 'industria', 'b'],
  ['Campaign05IndustriaSquare24s', 'icone-campaign-05-industria-square-a.mp4', 'industria', 'a'],
];

const getProps = (audience, hook, withCaptions) => {
  const props = {withCaptions};
  const voiceoverFile =
    audience === 'master'
      ? 'audio/campaign-05-master-vo.mp3'
      : `audio/campaign-05-${audience}-${hook}-vo.mp3`;

  if (existsSync(path.join(projectRoot, 'public', voiceoverFile))) {
    props.voiceoverFile = voiceoverFile;
  }

  const musicFile = 'audio/campaign-05-music.mp3';
  if (existsSync(path.join(projectRoot, 'public', musicFile))) {
    props.musicFile = musicFile;
  }

  return JSON.stringify(props);
};

const runRemotion = (args, description) => {
  console.log(`${dryRun ? '[dry-run] ' : ''}${description}`);
  if (dryRun) {
    return;
  }

  const result = spawnSync(remotionCommand, ['remotion', ...args], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${description} falhou com código ${result.status}.`);
  }
};

const renderVideo = ([composition, file, audience, hook], withCaptions) => {
  const suffix = withCaptions ? '' : '-clean';
  const target = path.join(
    outputDirectory,
    file.replace(/\.mp4$/, `${suffix}.mp4`),
  );
  const label = withCaptions ? 'com legendas' : 'sem legendas';

  runRemotion(
    [
      'render',
      composition,
      target,
      '--codec=h264',
      '--crf=18',
      '--pixel-format=yuv420p',
      `--props=${getProps(audience, hook, withCaptions)}`,
      '--concurrency=4',
    ],
    `Renderizando ${composition} (${label}) -> ${target}`,
  );
};

mkdirSync(outputDirectory, {recursive: true});

for (const output of onlyAds ? ads : [...masters, ...ads]) {
  renderVideo(output, true);
  if (includeClean) {
    renderVideo(output, false);
  }
}

if (!onlyAds) {
  const stills = [
    [1050, 'campaign-05-thumbnail.jpg'],
    [2160, 'campaign-05-poster.jpg'],
    [2220, 'campaign-05-cta-final.jpg'],
  ];
  const masterProps = getProps('master', 'a', false);

  for (const [frame, file] of stills) {
    const target = path.join(outputDirectory, file);
    runRemotion(
      [
        'still',
        'Campaign05MasterHorizontal75s',
        target,
        `--frame=${frame}`,
        `--props=${masterProps}`,
      ],
      `Gerando frame ${frame} -> ${target}`,
    );
  }
}

console.log(
  dryRun
    ? 'Plano de renderização da Campanha 05 validado.'
    : 'Pacote de entrega da Campanha 05 concluído.',
);
