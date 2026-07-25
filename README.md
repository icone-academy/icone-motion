# ICone — Inteligência para Gelato · Vídeo Institucional (Motion Graphics)

Projeto [Remotion](https://www.remotion.dev/) (React + TypeScript) do vídeo motion graphics institucional da **ICone — Inteligência para Gelato**, plataforma SaaS de ERP para gelaterias e sorveterias profissionais.

- **Resolução:** 1920×1080 · **FPS:** 30 · **Duração total:** 3:55 (7050 frames)
- **Identidade visual:** design system real do ICone Academy (taupe/cream, Oswald + Inter, sombras warm-brown, ícones Lucide outline)

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

| ID | Conteúdo | Timing | Frames |
|----|----------|--------|--------|
| `Main` | Vídeo completo (13 cenas) | 0:00–3:55 | 7050 |
| `Scene01` | Desafios da gelateria (caos + texto cinético) | 0:00–0:15 | 450 |
| `Scene02` | Reveal do logo + dashboard estilizado | 0:15–0:28 | 390 |
| `Scene03` | Banco de ingredientes (lista + tour de abas) | 0:28–0:58 | 900 |
| `Scene04` | Campo Fonte (USDA, TBCA, TACO, Fabricantes) | 0:58–1:13 | 450 |
| `Scene05` | Receita + gauges de indicadores | 1:13–1:33 | 600 |
| `Scene06` | Correção automática (antes/depois) | 1:33–1:56 | 690 |
| `Scene07` | Módulo de neutros (blend de partículas) | 1:56–2:16 | 600 |
| `SceneNutritionalTable` | Tabela nutricional + índice glicêmico (diet) | 2:16–2:36 | 600 |
| `Scene08` | Fluxo ingrediente → nutrição → ficha → rótulo | 2:36–2:53 | 510 |
| `SceneReverseEngineering` | Engenharia reversa de produtos do mercado | 2:53–3:13 | 600 |
| `Scene09` | Compra integrada (carrinho + fornecedor) | 3:13–3:30 | 510 |
| `Scene10` | Montagem de funcionalidades | 3:30–3:45 | 450 |
| `Scene11` | Logo + CTA "Garanta seu acesso antecipado" + QR | 3:45–3:55 | 300 |

## Estrutura

```
icone-motion/
├── public/brand/            # Logos oficiais (copiados do icone-frontend)
├── src/
│   ├── index.ts             # registerRoot
│   ├── Root.tsx             # Registra Main + 11 cenas individuais
│   ├── Main.tsx             # Timeline completa (Sequence por cena)
│   ├── timeline.ts          # FPS, resolução e duração das cenas em frames
│   ├── theme.ts             # Tokens do design system (cores, radius, sombras)
│   ├── fonts.ts             # Oswald (display) + Inter (corpo) via Google Fonts
│   ├── components/          # Reutilizáveis
│   │   ├── AnimatedText.tsx # Texto cinético palavra a palavra
│   │   ├── GaugeArc.tsx     # Gauge 270° com zonas e agulha animada
│   │   ├── GaugeBar.tsx     # Barra de métrica animada
│   │   ├── IconBadge.tsx    # Ícone Lucide em container soft
│   │   ├── LogoReveal.tsx   # Reveal do logotipo com halo
│   │   ├── Card.tsx / Pill.tsx / Eyebrow.tsx / FadeIn.tsx / SceneBackground.tsx
│   └── scenes/              # Scene01.tsx … Scene11.tsx
└── remotion.config.ts
```

## Observações

- **Sem áudio por enquanto** — os timings seguem a narração de referência do roteiro; a trilha/locução pode ser adicionada depois com `<Audio>` na `Main`.
- O QR code da Cena 11 (`public/brand/qr-icone-academy.png`) aponta para `https://icone.academy`. Para trocar o destino, gere outro com `npx qrcode "URL" -o public/brand/qr-icone-academy.png -w 512 -q 2 -d 3F3028 -l FFFFFF`.
- As fontes Oswald e Inter são carregadas via `@remotion/google-fonts` (requer internet no primeiro carregamento).
