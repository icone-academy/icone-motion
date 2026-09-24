# ICone — Inteligência para Gelato · Vídeo Institucional (Motion Graphics)

Projeto [Remotion](https://www.remotion.dev/) (React + TypeScript) do vídeo motion graphics institucional da **ICone — Inteligência para Gelato**, plataforma SaaS para gelaterias e sorveterias profissionais.

- **Resolução:** 1920×1080 · **FPS:** 60 · **Duração total (Main):** ~4:02.7 (sincronizado ao VO em `public/audio/vo.mp3`)
- **Identidade visual:** design system real do ICone Academy (taupe/cream, Oswald + Inter, sombras warm-brown, ícones Lucide outline)
- **Legibilidade mobile:** tokens `type.*` em `src/theme.ts` — tipografia/CTA/pills ampliados sem scale global. Cenas 3 e 5 usam beats fullscreen.
- **Timing:** cortes do VO em `src/timeline.ts` (`VO_CUTS`). Animações internas usam `useAuthoredFrame()` (base 30fps) para manter o ritmo e ganhar suavidade a 60fps.

## Como rodar

```bash
npm install
npm run dev
```

No Linux e no macOS, o projeto usa diretamente o compositor nativo do Remotion.
No Windows, os mesmos comandos executam automaticamente o ajuste local de FFmpeg
descrito abaixo.

## Como renderizar

```bash
# Garante FFmpeg funcional (Windows) e renderiza o vídeo completo
npm run render
# → out/icone-institucional.mp4

# Uma cena isolada
npx remotion render Scene06 out/cena06.mp4 --concurrency=4
```

### Windows: erro `kill EBADF` / encode em 0%

Causa típica: o `ffmpeg.exe` empacotado do Remotion crasha neste Windows; o Node 24 piora o cleanup (`kill EBADF`). O FFmpeg estático (BtbN GPL) não tem `libfdk_aac` — `remotion.config.ts` usa `mp3` (`libmp3lame`) por isso.

O projeto já inclui `scripts/ensure-ffmpeg.ps1`, que:

1. baixa um FFmpeg estático (BtbN) em `bin/ffmpeg/`
2. substitui `ffmpeg.exe` / `ffprobe.exe` dentro de `@remotion/compositor-win32-x64-msvc`

Rode se precisar:

```powershell
npm run fix:ffmpeg
```

No Windows, recomenda-se **Node 20 ou 22 LTS**; o arquivo `.nvmrc` aponta para 22.
Node 24 também é aceito pelo projeto no Linux e no macOS.

```powershell
nvm install 22
nvm use 22
npm run render
```

## Compositions registradas

| ID | Conteúdo | Timing (VO) | Frames |
|----|----------|-------------|--------|
| `Main` | Vídeo completo (12 cenas no Main) | 0:00–4:15 | 7650 |
| `Scene01` | Problema: informações espalhadas | 0:00–0:14 | 420 |
| `Scene02` | Marca ICone + plataforma única | 0:14–0:29 | 450 |
| `Scene03` | Banco de ingredientes (lista + abas rápidas) | 0:29–0:46 | 510 |
| `Scene04` | Fontes USDA / TBCA / TACO / fabricantes | 0:46–1:10 | 720 |
| `Scene05` | Receita: composição → gauges → resumo → explicação → nutrição | 1:10–2:08 | 1740 |
| `Scene08` | Etiqueta e ficha técnica | 2:08–2:20 | 360 |
| `Scene06` | Correção automática | 2:20–2:35 | 450 |
| `Scene07` | Módulo de neutros | 2:35–2:50 | 450 |
| `SceneReverseEngineering` | Engenharia reversa (ciência ICone, não IA) | 2:50–3:30 | 1200 |
| `Scene09` | Compra integrada | 3:30–3:43 | 390 |
| `Scene10` | Montagem / fechamento | 3:43–3:57 | 420 |
| `Scene11` | CTA lançamento 15/08/2026 | 3:57–4:15 | 540 |
| `SceneNutritionalTable` | Export isolado (fora do Main) | — | 600 |

### Campanhas promocionais

Além das campanhas 01–04, o projeto inclui a família **Campanha 05 — “Feita para o seu trabalho”**:

- master de 75s em 16:9, 9:16 e 1:1;
- cortes de 24s para gelateria, especialista e indústria;
- ganchos A/B verticais para mídia paga;
- legendas editoriais opcionais e suporte a voz/trilha por props;
- script de entrega com versões limpas, thumbnail, poster e CTA estático.

```bash
npm run render:campaign:05
```

Roteiro, nomenclatura das composições e checklist de áudio/QA: [`docs/campaign-05-feita-para-seu-trabalho.md`](docs/campaign-05-feita-para-seu-trabalho.md).

A **Campanha 01 V3 — “Resultado primeiro”** é o conceito atual para tráfego frio. A mensagem começa pela qualidade e pela consistência do gelato, demonstra o fluxo em linguagem simples e amplia a percepção do produto para ingredientes, neutros, custos e documentação. As composições principais usam a locução aprovada e sincronizada; não há efeitos sonoros, e a trilha continua opcional por prop.

```bash
npm run render:campaign:01:v3:vertical
npm run render:campaign:01:v3:square
npm run render:campaign:01:v3:horizontal
```

Roteiro, critérios de compreensão, direção visual e texto de locução: [`docs/campaign-01-v3-resultado-primeiro.md`](docs/campaign-01-v3-resultado-primeiro.md).

A **Campanha 01 V2 — “Produto primeiro”** foi mantida apenas como histórico e eventual comparação. Seus efeitos sonoros ficam desligados por padrão.

```bash
npm run render:campaign:01:v2:vertical
npm run render:campaign:01:v2:square
```

Roteiro, critérios de compreensão e texto de locução: [`docs/campaign-01-v2-product-first.md`](docs/campaign-01-v2-product-first.md).

## Estrutura

```
icone-motion/
├── public/brand/            # Logos oficiais (copiados do icone-frontend)
├── src/
│   ├── index.ts             # registerRoot
│   ├── Root.tsx             # Registra Main + cenas individuais
│   ├── Main.tsx             # Timeline sincronizada ao VO
│   ├── timeline.ts          # FPS, resolução e duração das cenas
│   ├── theme.ts             # Tokens do design system
│   ├── fonts.ts             # Oswald + Inter
│   ├── components/
│   └── scenes/
└── README.md
```
