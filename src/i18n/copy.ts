export type Copy = {
  brand: {
    name: string;
    tagline: string;
  };
  scene01: {
    introLead: string;
    pillars: [string, string, string];
    docLabels: string[];
    systemTitles: [string, string];
    kinetic: string[];
    spreadsheetFile: string;
    spreadsheetHeaders: [string, string, string];
    spreadsheetRows: [string, string, string][];
    techSheetTitle: string;
    techSheetSubtitle: string;
    notesTitle: string;
    notesLines: string[];
    calculatorTitle: string;
    calculatorError: string;
    systemNoIntegration: string;
    clipboardTitle: string;
    clipboardSubtitle: string;
    stickyNote: string;
    recipeTitle: string;
    recipeSubtitle: string;
    recipeRows: [string, string, string];
    recipeRowCrackedSuffix: string;
    chaosCaption: string;
    whySeparated: string;
    supportingLine: string;
  };
  scene02: {
    orbitingPillars: [string, string, string, string];
    convergingCaption: string;
    singlePlatform: string;
    developedFor: string;
    platformHeroEyebrow: string;
    platformHeroTitle: string;
    platformHeroSubtitle: string;
    modules: [string, string, string, string, string];
  };
  scene03: {
    bankTitle: string;
    searchPlaceholder: string;
    newIngredient: string;
    tableHeaders: [string, string, string, string, string, string, string];
    ingredients: {
      name: string;
      family: string;
    }[];
    flyingChips: {label: string; value: string}[];
    detailTitle: string;
    detailPills: [string, string];
    tabs: [string, string, string, string, string];
    identityTitle: string;
    identityLines: string[];
    applicationsTitle: string;
    applicationsLines: string[];
    compatibilitiesTitle: string;
    compatibilities: {label: string; value: string}[];
    compositionLabels: [string, string, string, string, string, string];
    compositionSlng: string;
    nutritionTitle: string;
    nutritionPer100: string;
    nutritionRows: string[];
    dosageHero: {label: string; value: string; sub: string}[];
    limitsTitle: string;
    limitsLines: string[];
    effectTitle: string;
    effectLines: string[];
    sourceBanner: string;
    sourceValidation: string;
    sourceValidated: string;
    sources: {name: string; detail: string}[];
  };
  scene04: {
    eyebrow: string;
    fieldSource: string;
    validated: string;
    referencesCount: string;
    seals: {name: string; full: string}[];
    closingTitle: string;
    closingSubtitle: string;
  };
  scene05: {
    recipeTitle: string;
    recipeVersion: string;
    save: string;
    print: string;
    eyebrows: {
      composition: string;
      gauges: string;
      resumo: string;
      explanation: string;
      nutrition: string;
    };
    analysisTabs: [string, string, string, string];
    status: {
      perfect: string;
      technical: string;
      out: string;
    };
    compositionHeaders: [string, string, string, string, string];
    compositionRows: {
      name: string;
      supplier: string;
      pricePerKg: string;
      priceInRecipe: string;
      qty: string;
    }[];
    scopeCertified: string;
    scopeWorkspace: string;
    footerCards: {label: string; value: string}[];
    calculating: string;
    callouts: {label: string; sub: string}[];
    gauges: {label: string; value: string}[];
    tempStripTitle: string;
    tempStripSubtitle: string;
    tempStripValue: string;
    resumoSections: {
      title: string;
      rows: {label: string; value: string}[];
    }[];
    explanationHeader: string;
    explanationSubheader: string;
    explanationBlocks: {text: string; emphasis: string}[];
    anvisa: {
      title: string;
      servingsLabel: string;
      servingsValue: string;
      portionLabel: string;
      portionValue: string;
      colPortion: string;
      col100: string;
      colVd: string;
      rows: {
        name: string;
        portion: string;
        per100: string;
        vd: string;
        indent?: boolean;
      }[];
      footer: string;
      badge: string;
      badgeNorm: string;
    };
    ctaGenerateLabel: string;
    ctaGenerateTechSheet: string;
  };
  scene06: {
    eyebrow: string;
    unbalanced: string;
    introTags: [string, string, string];
    processSteps: string[];
    before: string;
    after: string;
    statusPerfect: string;
    statusOut: string;
    params: {label: string; before: string; after: string}[];
    improvement: string;
    resultLine: string;
  };
  scene07: {
    eyebrow: string;
    subtitle: string;
    particles: string[];
    centerPill: string;
    blendTitle: string;
    blendBars: {label: string; value: string}[];
    compatibility: string;
    recommendedDose: string;
  };
  scene08: {
    eyebrow: string;
    subtitle: string;
    nodes: {label: string; sub: string}[];
    footer: string;
  };
  scene09: {
    eyebrow: string;
    subtitle: string;
    recipeTitle: string;
    recipeBadge: string;
    ingredients: {name: string; qty: string}[];
    outOfStock: string;
    flyingChip: string;
    supplierName: string;
    supplierPrimary: string;
    delivery: string;
    productLine: string;
    price: string;
    buyCta: string;
  };
  scene10: {
    eyebrow: string;
    features: string[];
    kinetic: string[];
    footer: string;
  };
  scene11: {
    headline: string;
    cta: string;
    site: string;
    qrHint: string;
    launch: string;
  };
  reverse: {
    eyebrow: string;
    problemTitle: string;
    problemSubtitle: string;
    marketProduct: string;
    scanLead: string;
    labelHeader: string;
    ingredientsHeader: string;
    labelIngredients: string[];
    labelNutritionTitle: string;
    labelNutritionRows: {name: string; value: string}[];
    processLead: string;
    processSteps: string[];
    resultTitle: string;
    reconstructionTitle: string;
    estimatePill: string;
    estimated: {label: string; value: string}[];
    outcomes: string[];
    scienceLine: string;
    disclaimer: string;
  };
  nutritional: {
    eyebrow: string;
    subtitleTable: string;
    subtitleGlycemic: string;
    anvisa: {
      title: string;
      servingsLabel: string;
      servingsValue: string;
      portionLabel: string;
      portionValue: string;
      colPortion: string;
      col100: string;
      colVd: string;
      rows: {
        name: string;
        portion: string;
        per100: string;
        vd: string;
        indent?: boolean;
      }[];
      footer: string;
      badge: string;
      badgeNorm: string;
    };
    glycemicLabel: string;
    glycemicStatus: string;
    glycemicCaption: string;
    feedsAutomatically: string;
    techSheet: string;
    labeling: string;
  };
};

export const pt: Copy = {
  brand: {
    name: 'ICONE',
    tagline: 'Inteligência para Gelato',
  },
  scene01: {
    introLead: 'Desenvolver uma receita profissional exige',
    pillars: ['Conhecimento', 'Precisão', 'Controle'],
    docLabels: [
      'Planilha',
      'Ficha técnica',
      'Anotações',
      'Cálculos manuais',
      'Sistema A',
      'Sistema B',
      'Receita impressa',
      'Post-it',
    ],
    systemTitles: ['ERP · Estoque', 'Compras · Excel'],
    kinetic: ['Formular.', 'Balancear.', 'Corrigir.', 'Documentar.', 'Comprar.'],
    spreadsheetFile: 'receita_v3.xlsx',
    spreadsheetHeaders: ['Ingrediente', 'g', '%'],
    spreadsheetRows: [
      ['Leite', '520', '52'],
      ['Açúcar', '180', '18'],
      ['???', '??', '??'],
    ],
    techSheetTitle: 'Ficha técnica',
    techSheetSubtitle: 'versão impressa · desatualizada',
    notesTitle: 'Caderno da produção',
    notesLines: [
      'PAC alto — conferir',
      'trocar dextrose?',
      'temp. ????',
      'pedir pistache',
    ],
    calculatorTitle: 'Balanço manual',
    calculatorError: 'ERR',
    systemNoIntegration: 'sem integração com a receita',
    clipboardTitle: 'Receita impressa',
    clipboardSubtitle: 'última atualização desconhecida',
    stickyNote: 'lembrar de conferir POD!!',
    recipeTitle: 'Receita profissional',
    recipeSubtitle: 'Gelato artesanal & industrial',
    recipeRows: ['Composição', 'Parâmetros técnicos', 'Documentação'],
    recipeRowCrackedSuffix: ' — espalhado',
    chaosCaption:
      'Informações espalhadas entre planilhas, fichas, anotações e sistemas diferentes.',
    whySeparated: 'Por que tudo isso precisa estar separado?',
    supportingLine:
      'Conhecimento, precisão e controle — espalhados em pedaços.',
  },
  scene02: {
    orbitingPillars: [
      'Formulação',
      'Balanceamento',
      'Conhecimento técnico',
      'Acesso a ingredientes',
    ],
    convergingCaption: 'Reunindo as peças do gelato profissional…',
    singlePlatform: 'Uma única plataforma',
    developedFor: 'Desenvolvida para o gelato artesanal e industrial',
    platformHeroEyebrow: 'Gelato artesanal & industrial',
    platformHeroTitle: 'Tudo o que a produção precisa — reunido.',
    platformHeroSubtitle:
      'Formulação, balanceamento, conhecimento técnico e ingredientes.',
    modules: [
      'Formulação',
      'Balanceamento',
      'Conhecimento',
      'Ingredientes',
      'Compras',
    ],
  },
  scene03: {
    bankTitle: 'Banco de Ingredientes',
    searchPlaceholder: 'Buscar ingrediente...',
    newIngredient: 'Novo Ingrediente',
    tableHeaders: [
      'Nome',
      'Família',
      'Água',
      'Gordura',
      'Açúcares',
      'PAC',
      'POD',
    ],
    ingredients: [
      {name: 'Leite em pó desnatado', family: 'Lácteos'},
      {name: 'Pistache puro', family: 'Oleaginosas'},
      {name: 'Sacarose', family: 'Açúcares'},
      {name: 'Dextrose', family: 'Açúcares'},
      {name: 'Creme de leite 35%', family: 'Lácteos'},
      {name: 'Polpa de morango', family: 'Frutas'},
    ],
    flyingChips: [
      {label: 'Quanto usar', value: '8–11%'},
      {label: 'Temperatura', value: '65–70 °C'},
      {label: 'Inserção', value: 'Pós-pasteurização'},
      {label: 'Gordura', value: '45%'},
      {label: 'Dose máx.', value: '12%'},
      {label: 'PAC · POD', value: '0,50 · 0,42'},
    ],
    detailTitle: 'Pistache puro',
    detailPills: ['Ingrediente simples', 'Oleaginosa'],
    tabs: [
      'Geral',
      'Composição',
      'Tabela nutricional',
      'Dosagem',
      'Fonte',
    ],
    identityTitle: 'Identidade',
    identityLines: [
      'Nome · Pistache puro (pasta 100%)',
      'Família · Oleaginosas',
      'Tipo · Ingrediente simples',
      'Origem · Pasta de pistache verde',
      'Status · Ativo no workspace',
    ],
    applicationsTitle: 'Aplicações práticas',
    applicationsLines: [
      'Gelato premium de pistache',
      'Base branca e mantecados',
      'Overrun sugerido · 25–35%',
      'Conservar pasta refrigerada',
      'Sabor intenso · dose controlada',
    ],
    compatibilitiesTitle: 'Compatibilidades',
    compatibilities: [
      {label: 'Combina', value: 'Dextrose + leite em pó'},
      {label: 'Sinergia', value: 'Creme 35%'},
      {label: 'Substitui', value: 'Pasta de avelã (com ajuste)'},
      {label: 'Evitar', value: 'Excesso de água livre'},
    ],
    compositionLabels: [
      'Água',
      'Gordura',
      'Açúcares',
      'Proteína',
      'Sólidos totais',
      'Fibras',
    ],
    compositionSlng: 'SLNG · 50%',
    nutritionTitle: 'Tabela nutricional',
    nutritionPer100: 'por 100 g',
    nutritionRows: [
      'Valor energético',
      'Carboidratos',
      'Açúcares totais',
      'Gorduras totais',
      'Gorduras saturadas',
      'Proteínas',
      'Fibras alimentares',
      'Sódio',
    ],
    dosageHero: [
      {label: 'Quanto usar', value: '8–11%', sub: 'da mistura final'},
      {label: 'Temperatura', value: '65–70 °C', sub: 'na inserção'},
      {
        label: 'Momento',
        value: 'Pós-pasteurização',
        sub: 'antes do aging',
      },
    ],
    limitsTitle: 'Limites e protocolo',
    limitsLines: [
      'Dose máxima · 12% da mistura',
      'Homogeneizar 2–3 min após inserção',
      'Não aquecer acima de 75 °C',
      'Incorporar com mixer ou turbo',
    ],
    effectTitle: 'Efeito na receita',
    effectLines: [
      'Eleva gordura e sólidos totais',
      'Contribui pouco para PAC/POD',
      'Cor e sabor característicos',
      'Ajustar açúcares se dose > 10%',
    ],
    sourceBanner: 'Dados documentados e rastreáveis',
    sourceValidation: 'Última validação · 12/07/2026 · Confiança alta',
    sourceValidated: 'Validado',
    sources: [
      {
        name: 'Ficha do fabricante',
        detail: 'Pasta 100% pistache · lote 2026',
      },
      {name: 'TBCA', detail: 'Tabela Brasileira de Composição'},
      {name: 'USDA', detail: 'FoodData Central · referência cruzada'},
    ],
  },
  scene04: {
    eyebrow: 'Origem dos dados',
    fieldSource: 'Campo Fonte',
    validated: 'Validado · 12/07/2026',
    referencesCount: '3 referências',
    seals: [
      {name: 'USDA', full: 'FoodData Central'},
      {name: 'TBCA', full: 'Tabela Brasileira'},
      {name: 'TACO', full: 'Unicamp'},
      {name: 'Fabricantes', full: 'Fichas técnicas'},
    ],
    closingTitle: 'Dados documentados e rastreáveis',
    closingSubtitle:
      'Mais confiabilidade, coerência e rastreabilidade aos cálculos.',
  },
  scene05: {
    recipeTitle: 'Gelato de Pistache',
    recipeVersion: 'v1.2',
    save: 'Salvar',
    print: 'Imprimir',
    eyebrows: {
      composition: 'Criação de receita',
      gauges: 'Parâmetros técnicos',
      resumo: 'Aba Resumo',
      explanation: 'Aba Explicação',
      nutrition: 'Valores nutricionais',
    },
    analysisTabs: ['Gauges', 'Resumo', 'Explicação', 'Valores Nutricionais'],
    status: {
      perfect: 'Ótimo',
      technical: 'Bom',
      out: 'Atenção',
    },
    compositionHeaders: [
      'Ingrediente',
      'Fornecedor',
      'Preço/kg',
      'Preço na receita',
      'Peso',
    ],
    compositionRows: [
      {
        name: 'Leite integral',
        supplier: 'Laticínios Serra',
        pricePerKg: 'R$ 4,80',
        priceInRecipe: 'R$ 2,50',
        qty: '520 g',
      },
      {
        name: 'Creme de leite 35%',
        supplier: 'Laticínios Serra',
        pricePerKg: 'R$ 18,90',
        priceInRecipe: 'R$ 3,40',
        qty: '180 g',
      },
      {
        name: 'Sacarose',
        supplier: 'Doce Brasil',
        pricePerKg: 'R$ 5,20',
        priceInRecipe: 'R$ 0,99',
        qty: '190 g',
      },
      {
        name: 'Pistache puro',
        supplier: 'Nuts & Co',
        pricePerKg: 'R$ 186,00',
        priceInRecipe: 'R$ 14,88',
        qty: '80 g',
      },
      {
        name: 'Leite em pó desnatado',
        supplier: 'Laticínios Serra',
        pricePerKg: 'R$ 32,00',
        priceInRecipe: 'R$ 0,80',
        qty: '25 g',
      },
      {
        name: 'Neutro base branca',
        supplier: 'ICone Neutros',
        pricePerKg: 'R$ 98,00',
        priceInRecipe: 'R$ 0,49',
        qty: '5 g',
      },
    ],
    scopeCertified: 'Certificado ICone',
    scopeWorkspace: 'Seu cadastro',
    footerCards: [
      {label: 'Peso Total', value: '1.000 g'},
      {label: 'Custo Total na Receita', value: 'R$ 23,06'},
      {label: 'Custo/kg', value: 'R$ 23,06/Kg'},
      {label: 'Alvo de produção', value: '5.000 g'},
    ],
    calculating: 'Calculando parâmetros técnicos…',
    callouts: [
      {label: 'Certificados', sub: 'Ingredientes ICone'},
      {label: 'Workspace', sub: 'Seus ingredientes'},
      {label: 'Custo', sub: 'Fornecedores vinculados'},
      {label: 'Produção', sub: 'Alvo · 5.000 g'},
    ],
    gauges: [
      {label: 'Água', value: '64%'},
      {label: 'Açúcares Totais', value: '22%'},
      {label: 'Gordura Totais', value: '8%'},
      {label: 'Proteínas', value: '4,2%'},
      {label: 'Sólidos Totais', value: '38%'},
      {label: 'PAC', value: '28'},
      {label: 'POD', value: '18'},
      {label: 'Overrun final', value: '28%'},
      {label: 'Cristalização', value: '88%'},
      {label: 'Cremosidade', value: '74%'},
      {label: 'Lactose', value: '5%'},
      {label: 'Índice glicêmico', value: '42%'},
    ],
    tempStripTitle: 'Temperatura ideal da vitrine',
    tempStripSubtitle: 'Comportamento estável para exposição e serviço',
    tempStripValue: '−12,5 °C',
    resumoSections: [
      {
        title: 'Composição complementar',
        rows: [
          {label: 'Lactose', value: '5%'},
          {label: 'Fibras', value: '0,8%'},
          {label: 'Frutas', value: '0%'},
          {label: 'SLNG', value: '9%'},
          {label: 'Outros sólidos', value: '3%'},
          {label: 'Neutro / Estabilizante', value: '0,5%'},
        ],
      },
      {
        title: 'Água Livre & Cristalização',
        rows: [
          {label: 'Água livre', value: '12%'},
          {label: 'Índice de cristalização', value: '42'},
          {label: 'Qualidade da cristalização', value: '88%'},
        ],
      },
      {
        title: 'Viscosidade & Cremosidade',
        rows: [
          {label: 'Índice de viscosidade', value: '68'},
          {label: 'Cremosidade real', value: '74'},
          {label: 'Índice de derretimento', value: '55'},
          {label: 'Índice de paladar', value: '72'},
        ],
      },
      {
        title: 'Comportamento por Temperatura',
        rows: [
          {label: 'Temp. ideal da vitrine', value: '−12,5 °C'},
          {label: 'Mantecação (−6 °C)', value: '82'},
          {label: 'Vitrine (−10 °C)', value: '78'},
          {label: 'Freezer (−18 °C)', value: '85'},
        ],
      },
      {
        title: 'Simulação de Qualidade',
        rows: [
          {label: 'Maciez do gelato na vitrine', value: '78'},
          {label: 'Cremosidade na vitrine', value: '81'},
          {label: 'Estabilidade na vitrine', value: '76'},
        ],
      },
      {
        title: 'Índices do Gelato',
        rows: [
          {label: 'Espátulabilidade', value: '82'},
          {label: 'Corpo', value: '79'},
          {label: 'Estabilidade da estrutura', value: '84'},
          {label: 'Índice global do gelato', value: '80'},
        ],
      },
    ],
    explanationHeader: 'Inteligência ICone',
    explanationSubheader: 'Tradução simples dos parâmetros técnicos',
    explanationBlocks: [
      {
        text: 'Esta receita está bem equilibrada para um gelato de pistache.',
        emphasis: 'equilibrada',
      },
      {
        text: 'A água e os açúcares estão na faixa ideal — o gelato congela de forma limpa e cremosa.',
        emphasis: 'faixa ideal',
      },
      {
        text: 'O PAC indica ponto de congelamento adequado para vitrine; o POD traz doçura equilibrada sem mascarar o pistache.',
        emphasis: 'PAC',
      },
      {
        text: 'Overrun e cremosidade sugerem boa estrutura na mantecação e estabilidade na exposição.',
        emphasis: 'cremosidade',
      },
    ],
    anvisa: {
      title: 'Informação nutricional',
      servingsLabel: 'Porções por embalagem:',
      servingsValue: '8',
      portionLabel: 'Porção:',
      portionValue: '60 g (1 bola)',
      colPortion: '60 g',
      col100: '100 g',
      colVd: '%VD*',
      rows: [
        {
          name: 'Valor energético (kcal)',
          portion: '129',
          per100: '215',
          vd: '6%',
        },
        {
          name: 'Carboidratos (g)',
          portion: '14',
          per100: '24',
          vd: '5%',
        },
        {
          name: 'Açúcares totais (g)',
          portion: '13',
          per100: '21',
          vd: '—',
          indent: true,
        },
        {
          name: 'Açúcares adicionados (g)',
          portion: '11',
          per100: '18',
          vd: '22%',
          indent: true,
        },
        {
          name: 'Proteínas (g)',
          portion: '2,3',
          per100: '3,8',
          vd: '5%',
        },
        {
          name: 'Gorduras totais (g)',
          portion: '6,6',
          per100: '11',
          vd: '10%',
        },
        {
          name: 'Gorduras saturadas (g)',
          portion: '3,4',
          per100: '5,6',
          vd: '17%',
          indent: true,
        },
        {
          name: 'Gorduras trans (g)',
          portion: '0',
          per100: '0',
          vd: '0%',
          indent: true,
        },
        {
          name: 'Fibra alimentar (g)',
          portion: '0,5',
          per100: '0,8',
          vd: '2%',
        },
        {name: 'Sódio (mg)', portion: '27', per100: '45', vd: '1%'},
      ],
      footer:
        '*Percentual de valores diários com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.',
      badge:
        'Calculada automaticamente a partir dos ingredientes · normas',
      badgeNorm: 'ANVISA (RDC 429/2020)',
    },
    ctaGenerateLabel: 'Gerar Etiqueta',
    ctaGenerateTechSheet: 'Gerar Ficha Técnica',
  },
  scene06: {
    eyebrow: 'Correção automática',
    unbalanced: 'Receita desequilibrada.',
    introTags: ['PAC 32.4', 'Sólidos 46%', 'Açúcares 26%'],
    processSteps: [
      'Analisando a formulação',
      'Ajustando açúcares e sólidos',
      'Preservando a identidade da receita',
      'Validando parâmetros técnicos',
    ],
    before: 'Antes',
    after: 'Depois',
    statusPerfect: 'Perfect',
    statusOut: 'Out',
    params: [
      {label: 'PAC', before: '32.4', after: '27.8'},
      {label: 'Sólidos totais', before: '46%', after: '38%'},
      {label: 'Açúcares', before: '26%', after: '21%'},
      {label: 'POD', before: '11.2', after: '16.5'},
    ],
    improvement: '+38% de melhora',
    resultLine:
      'ICone não apenas identifica o problema. Ele propõe uma solução.',
  },
  scene07: {
    eyebrow: 'Módulo de Neutros',
    subtitle:
      'Combinações personalizadas de estabilizantes e emulsionantes',
    particles: [
      'LBG',
      'Guar',
      'Carragena',
      'Emulsificante',
      'Tara',
      'Xantana',
      'CMC',
    ],
    centerPill: 'Neutro personalizado',
    blendTitle: 'Neutro Base Branca v2',
    blendBars: [
      {label: 'LBG (alfarroba)', value: '40%'},
      {label: 'Guar', value: '30%'},
      {label: 'Carragena', value: '20%'},
      {label: 'Mono e diglicerídeos', value: '10%'},
    ],
    compatibility: 'Compatibilidade alta',
    recommendedDose: 'Dose recomendada · 4,5 g/kg',
  },
  scene08: {
    eyebrow: 'Do ingrediente ao rótulo',
    subtitle: 'Os dados fluem automaticamente entre receita e documentos',
    nodes: [
      {label: 'Ingrediente', sub: 'dados de origem'},
      {label: 'Cálculo nutricional', sub: 'automático'},
      {label: 'Ficha técnica', sub: 'documento vivo'},
      {label: 'Rótulo', sub: 'pronto p/ rotulagem'},
    ],
    footer: 'Menos trabalho manual. Coerência entre a receita e seus documentos.',
  },
  scene09: {
    eyebrow: 'Fornecedores e compras',
    subtitle:
      'Adquira os ingredientes da receita diretamente pela plataforma',
    recipeTitle: 'Gelato de Pistache',
    recipeBadge: 'Receita',
    ingredients: [
      {name: 'Leite integral', qty: '520 g'},
      {name: 'Pistache puro', qty: '80 g'},
      {name: 'Sacarose', qty: '190 g'},
      {name: 'Neutro base branca', qty: '5 g'},
    ],
    outOfStock: 'em falta',
    flyingChip: 'Pistache puro · 1 kg',
    supplierName: 'Distribuidora Gelato Sul',
    supplierPrimary: 'Fornecedor principal',
    delivery: 'Entrega em 2 dias',
    productLine: 'Pistache puro · 1 kg',
    price: 'R$ 189,90',
    buyCta: 'Comprar pela plataforma',
  },
  scene10: {
    eyebrow: 'Tudo em uma única plataforma',
    features: [
      'Balanceamento',
      'Ingredientes',
      'Fontes validadas',
      'Correção automática',
      'Neutros',
      'Cálculo nutricional',
      'Fichas técnicas',
      'Rotulagem',
      'Fornecedores',
      'Compras',
    ],
    kinetic: [
      'Conhecimento técnico.',
      'Formulação.',
      'Correção.',
      'Documentação.',
      'Ingredientes.',
    ],
    footer:
      'Mais organização, mais controle e mais segurança para padronizar resultados.',
  },
  scene11: {
    headline:
      'Uma nova forma de formular, corrigir e criar gelato profissional',
    cta: 'Garanta seu acesso antecipado',
    site: 'icone.academy',
    qrHint: 'Aponte a câmera',
    launch: 'Lançamento · 15 de agosto de 2026',
  },
  reverse: {
    eyebrow: 'Engenharia reversa',
    problemTitle:
      'Sem a formulação completa, balancear e rotular fica difícil.',
    problemSubtitle:
      'Ingredientes de empresas especializadas — na maioria das vezes, sem acesso à receita completa do produto.',
    marketProduct: 'Produto do mercado',
    scanLead:
      'A ICone parte das informações do rótulo para reconstruir a composição.',
    labelHeader: 'Informações declaradas no rótulo',
    ingredientsHeader: 'Ingredientes',
    labelIngredients: [
      'Leite integral, açúcar, xarope de glicose,',
      'gordura vegetal, soro de leite em pó,',
      'pasta de pistache, emulsificantes (mono e',
      'diglicerídeos), estabilizantes (LBG, guar).',
    ],
    labelNutritionTitle: 'Tabela nutricional · porção 60 g',
    labelNutritionRows: [
      {name: 'Valor energético', value: '215 kcal'},
      {name: 'Carboidratos', value: '24 g'},
      {name: 'Açúcares totais', value: '21 g'},
      {name: 'Gorduras totais', value: '11 g'},
      {name: 'Proteínas', value: '3,8 g'},
    ],
    processLead:
      'Ciência e experiência técnica da ICone — não inteligência artificial.',
    processSteps: [
      'Lendo as informações do rótulo',
      'Cruzando com o banco técnico da ICone',
      'Reconstruindo uma composição coerente',
    ],
    resultTitle: 'Composição estimada — para entender, balancear e rotular',
    reconstructionTitle: 'Reconstrução coerente a partir do rótulo',
    estimatePill: 'Estimativa técnica',
    estimated: [
      {label: 'Leite integral', value: '~46%'},
      {label: 'Açúcares (sacarose + glicose)', value: '~22%'},
      {label: 'Gordura vegetal', value: '~12%'},
      {label: 'Soro de leite em pó', value: '~9%'},
      {label: 'Pasta de pistache', value: '~6%'},
      {label: 'Neutros e emulsificantes', value: '~1%'},
    ],
    outcomes: [
      'Balancear a receita com segurança',
      'Gerar etiqueta confiável',
    ],
    scienceLine:
      'Esse trabalho não é feito por inteligência artificial — é resultado da ciência e da experiência técnica da ICone.',
    disclaimer:
      'Estimativa técnica com base no rótulo — não uma fórmula exata do fabricante.',
  },
  nutritional: {
    eyebrow: 'Nutrição da receita',
    subtitleTable:
      'Tabela nutricional completa — gerada automaticamente a partir dos ingredientes',
    subtitleGlycemic: 'Índice glicêmico calculado automaticamente',
    anvisa: {
      title: 'Informação nutricional',
      servingsLabel: 'Porções por embalagem:',
      servingsValue: '8',
      portionLabel: 'Porção:',
      portionValue: '60 g (1 bola)',
      colPortion: '60 g',
      col100: '100 g',
      colVd: '%VD*',
      rows: [
        {
          name: 'Valor energético (kcal)',
          portion: '129',
          per100: '215',
          vd: '6%',
        },
        {
          name: 'Carboidratos (g)',
          portion: '14',
          per100: '24',
          vd: '5%',
        },
        {
          name: 'Açúcares totais (g)',
          portion: '13',
          per100: '21',
          vd: '—',
          indent: true,
        },
        {
          name: 'Açúcares adicionados (g)',
          portion: '11',
          per100: '18',
          vd: '22%',
          indent: true,
        },
        {
          name: 'Proteínas (g)',
          portion: '2,3',
          per100: '3,8',
          vd: '5%',
        },
        {
          name: 'Gorduras totais (g)',
          portion: '6,6',
          per100: '11',
          vd: '10%',
        },
        {
          name: 'Gorduras saturadas (g)',
          portion: '3,4',
          per100: '5,6',
          vd: '17%',
          indent: true,
        },
        {
          name: 'Gorduras trans (g)',
          portion: '0',
          per100: '0',
          vd: '0%',
          indent: true,
        },
        {
          name: 'Fibra alimentar (g)',
          portion: '0,5',
          per100: '0,8',
          vd: '2%',
        },
        {name: 'Sódio (mg)', portion: '27', per100: '45', vd: '1%'},
      ],
      footer:
        '*Percentual de valores diários com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.',
      badge: 'Tabela elaborada conforme as normas da',
      badgeNorm: 'ANVISA (RDC nº 429/2020 e IN nº 75/2020).',
    },
    glycemicLabel: 'Índice glicêmico',
    glycemicStatus: 'Baixo',
    glycemicCaption:
      'Mais uma camada de precisão para produtos com restrição de açúcar.',
    feedsAutomatically: 'Alimenta automaticamente',
    techSheet: 'Ficha técnica',
    labeling: 'Rotulagem',
  },
};
