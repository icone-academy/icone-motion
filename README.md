# ICone — Inteligência para Gelato · Vídeo Institucional (Motion Graphics)

Projeto [Remotion](https://www.remotion.dev/) (React + TypeScript) do vídeo motion graphics institucional da **ICone — Inteligência para Gelato**, plataforma SaaS de ERP para gelaterias e sorveterias profissionais.

- **Resolução:** 1920×1080 · **FPS:** 30 · **Duração total (Main):** 4:15 (7650 frames) — sincronizado ao VO
- **Identidade visual:** design system real do ICone Academy (taupe/cream, Oswald + Inter, sombras warm-brown, ícones Lucide outline)
- **Legibilidade mobile:** tokens `type.*` em `src/theme.ts` — tipografia/CTA/pills ampliados sem scale global. Cenas 3 e 5 usam beats fullscreen.

## Como rodar

```bash
npm install
npx remotion studio
```

## Como renderizar

```bash
# Vídeo completo
npm run render
# → out/icone-institucional.mp4

# Uma cena isolada (ex.: Cena 6)
npx remotion render Scene06 out/cena06.mp4
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
