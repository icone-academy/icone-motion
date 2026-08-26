# Campanha ICone 05 — Feita para o seu trabalho

## Objetivo

Filme de aquisição que identifica diretamente três grupos — gelaterias/sorveterias, especialistas técnicos e indústrias — e demonstra a ICone como um fluxo conectado de formulação, análise, custo e documentação.

A campanha não chama a ICone de ERP, não promete percentuais de economia e não afirma conformidade automática. A economia é comunicada por mecanismos verificáveis: menos retrabalho, cálculos centralizados e autonomia para gerar documentos.

## Roteiro do filme principal

> Você formula numa gelateria, desenvolve receitas para clientes ou precisa padronizar uma produção industrial? Então, a ICone foi feita para o seu trabalho. Porque receita, custo, fornecedores, ficha técnica e etiqueta não deveriam viver separados. A ICone conecta todo esse fluxo, do ingrediente ao rótulo. Você começa com uma base de mais de quinhentos ingredientes validados, cadastra os seus, constrói neutros e usa engenharia reversa. Enquanto formula, acompanha água, açúcares, sólidos e outros parâmetros em tempo real. Identifica desequilíbrios e testa ajustes antes de produzir. Com os fornecedores conectados à receita, o custo deixa de ser uma surpresa. E da mesma fórmula você gera tabela nutricional, etiqueta e ficha técnica personalizada com a marca da sua empresa, sem recomeçar o trabalho em outra ferramenta. Mais consistência para a gelateria. Mais produtividade para quem atende clientes. Mais controle para quem produz em escala. ICone. Inteligência para Gelato. Comece grátis em icone.academy.

## Timeline do master

| Tempo | Beat | Prova visual |
| --- | --- | --- |
| 0–10,3s | Identificação | Gelateria, especialista e indústria |
| 10,3–17,2s | Problema | Planilha, cálculos, fornecedor, ficha e etiqueta dispersos |
| 17,2–21,6s | Promessa | Fluxo contínuo do ingrediente ao rótulo |
| 21,6–31s | Base técnica | +500 ingredientes, neutros e engenharia reversa |
| 31–46s | Decisão | Receita, gauges, equilíbrio, fornecedores e custo |
| 46–56,7s | Documentos | Tabela nutricional, etiqueta e ficha técnica |
| 56,7–64,6s | Resultado | Consistência, produtividade e controle |
| 64,6–75s | CTA | Comece grátis em icone.academy |

## Composições

### Master de 75 segundos

- `Campaign05MasterHorizontal75s`
- `Campaign05MasterVertical75s`
- `Campaign05MasterSquare75s`

### Cortes de 24 segundos

Cada público possui master horizontal, vertical e quadrado com o gancho A. A versão vertical também possui `HookB` para teste de mídia:

- `Campaign05Gelateria*`
- `Campaign05Especialista*`
- `Campaign05Industria*`

As composições aceitam:

- `format`: `horizontal | vertical | square`
- `audience`: `master | gelateria | especialista | industria`
- `hookVariant`: `a | b`
- `withCaptions`: inclui ou remove as legendas incorporadas
- `voiceoverFile`: caminho opcional dentro de `public/`
- `musicFile`: caminho opcional da trilha licenciada dentro de `public/`
- `muted`: remove voz e trilha

## Áudio

A Campanha 05 não utiliza efeitos sonoros. O áudio final é composto somente por
locução e, quando fornecida, trilha licenciada. Adicionar os arquivos aprovados:

- `public/audio/campaign-05-master-vo.mp3`
- `public/audio/campaign-05-gelateria-a-vo.mp3`
- `public/audio/campaign-05-gelateria-b-vo.mp3`
- `public/audio/campaign-05-especialista-a-vo.mp3`
- `public/audio/campaign-05-especialista-b-vo.mp3`
- `public/audio/campaign-05-industria-a-vo.mp3`
- `public/audio/campaign-05-industria-b-vo.mp3`
- `public/audio/campaign-05-music.mp3`

O script de entrega detecta esses arquivos automaticamente. Sem eles, os renders
continuam funcionais com texto editorial e legendas, sem áudio.

Os textos integrais para geração de cada locução estão em
[`campaign-05-locucoes.md`](campaign-05-locucoes.md).

## Render

```bash
# pacote completo, incluindo versões sem legenda
npm run render:campaign:05

# somente os anúncios
npm run render:campaign:05:ads
```

Os dois comandos são multiplataforma (Linux, macOS e Windows).

Os vídeos, thumbnails e frames estáticos são gravados em `out/campaign-05/`.

## Checklist de aprovação

- Confirmar que a afirmação “+500 ingredientes validados” continua atual.
- Revisar a locução temporária e a pronúncia de ICone e RDC 429.
- Validar as telas/dados sanitizados e a ausência de informações de clientes.
- Revisar legibilidade com e sem som em celular real.
- Confirmar o CTA e as UTMs na landing antes de publicar.
