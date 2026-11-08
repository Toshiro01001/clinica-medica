/* Dados fictícios da Clínica Alameda. Nada aqui é real: nomes, registros, convênios, exames e valores foram inventados para a demonstração. */
window.CLINICA = {
  especialidades: [
    { id: "clinica-geral", nome: "Clínica Geral" },
    { id: "cardiologia", nome: "Cardiologia" },
    { id: "dermatologia", nome: "Dermatologia" },
    { id: "pediatria", nome: "Pediatria" },
    { id: "ginecologia", nome: "Ginecologia" },
    { id: "ortopedia", nome: "Ortopedia" },
    { id: "endocrinologia", nome: "Endocrinologia" },
    { id: "oftalmologia", nome: "Oftalmologia" }
  ],

  convenios: [
    { id: "particular", nome: "Particular" },
    { id: "horizonte", nome: "Saúde Horizonte" },
    { id: "vida-plena", nome: "Vida Plena" },
    { id: "amparo", nome: "Amparo Seguros" },
    { id: "bem-viver", nome: "Bem Viver" },
    { id: "norte-sul", nome: "Norte Sul Saúde" }
  ],

  /* dias: 1 = segunda ... 6 = sábado. turno: hora de início e fim do atendimento, consultas de 30 em 30 minutos. */
  medicos: [
    { id: "helena-prado", nome: "Dra. Helena Prado", esp: "clinica-geral", convenios: ["particular", "horizonte", "vida-plena", "bem-viver"], dias: [1, 2, 3, 4, 5], turno: [7, 12], registro: "CRM demonstrativo 0001" },
    { id: "otavio-lins", nome: "Dr. Otávio Lins", esp: "clinica-geral", convenios: ["particular", "amparo", "norte-sul"], dias: [1, 3, 5], turno: [13, 19], registro: "CRM demonstrativo 0002" },
    { id: "marina-castelo", nome: "Dra. Marina Castelo", esp: "cardiologia", convenios: ["particular", "horizonte", "amparo"], dias: [2, 4], turno: [8, 12], registro: "CRM demonstrativo 0003" },
    { id: "rubens-faria", nome: "Dr. Rubens Faria", esp: "cardiologia", convenios: ["particular", "vida-plena", "norte-sul", "bem-viver"], dias: [1, 3, 5], turno: [14, 18], registro: "CRM demonstrativo 0004" },
    { id: "cecilia-amorim", nome: "Dra. Cecília Amorim", esp: "dermatologia", convenios: ["particular", "horizonte", "bem-viver"], dias: [1, 2, 4], turno: [8, 13], registro: "CRM demonstrativo 0005" },
    { id: "joao-pedro-vale", nome: "Dr. João Pedro Vale", esp: "pediatria", convenios: ["particular", "horizonte", "vida-plena", "amparo", "norte-sul"], dias: [1, 2, 3, 4, 5, 6], turno: [7, 12], registro: "CRM demonstrativo 0006" },
    { id: "luiza-tavares", nome: "Dra. Luiza Tavares", esp: "pediatria", convenios: ["particular", "bem-viver", "vida-plena"], dias: [2, 4, 6], turno: [13, 18], registro: "CRM demonstrativo 0007" },
    { id: "ana-beatriz-rocha", nome: "Dra. Ana Beatriz Rocha", esp: "ginecologia", convenios: ["particular", "horizonte", "amparo", "norte-sul"], dias: [1, 3, 5], turno: [8, 13], registro: "CRM demonstrativo 0008" },
    { id: "caio-monteiro", nome: "Dr. Caio Monteiro", esp: "ortopedia", convenios: ["particular", "vida-plena", "amparo", "bem-viver"], dias: [2, 3, 5], turno: [13, 19], registro: "CRM demonstrativo 0009" },
    { id: "sofia-arruda", nome: "Dra. Sofia Arruda", esp: "endocrinologia", convenios: ["particular", "horizonte", "vida-plena", "norte-sul"], dias: [1, 4], turno: [8, 12], registro: "CRM demonstrativo 0010" },
    { id: "henrique-salles", nome: "Dr. Henrique Salles", esp: "oftalmologia", convenios: ["particular", "amparo", "bem-viver", "horizonte"], dias: [1, 2, 3, 4, 5], turno: [14, 18], registro: "CRM demonstrativo 0011" },
    { id: "renata-quintal", nome: "Dra. Renata Quintal", esp: "oftalmologia", convenios: ["particular", "vida-plena", "norte-sul"], dias: [6], turno: [7, 12], registro: "CRM demonstrativo 0012" }
  ],

  acesso: {
    usuario: "paciente.demo",
    senha: "demo1234",
    paciente: {
      nome: "Helena Demonstração",
      nascimento: "12/03/1982",
      convenio: "Saúde Horizonte",
      carteirinha: "0000 0000 0000 (fictícia)"
    }
  },

  exames: [
    {
      nome: "Hemograma completo",
      data: "28/10/2026",
      estado: "disponivel",
      solicitante: "Dra. Helena Prado",
      itens: [
        { nome: "Hemoglobina", valor: 13.4, unidade: "g/dL", min: 12.0, max: 15.5 },
        { nome: "Hematócrito", valor: 40.1, unidade: "%", min: 36.0, max: 46.0 },
        { nome: "Leucócitos", valor: 6800, unidade: "/mm³", min: 4000, max: 11000 },
        { nome: "Plaquetas", valor: 245000, unidade: "/mm³", min: 150000, max: 450000 }
      ],
      nota: "Todos os valores dentro da faixa de referência."
    },
    {
      nome: "Glicemia em jejum",
      data: "28/10/2026",
      estado: "disponivel",
      solicitante: "Dra. Sofia Arruda",
      itens: [
        { nome: "Glicose", valor: 104, unidade: "mg/dL", min: 70, max: 99 }
      ],
      nota: "Valor um pouco acima da faixa. A médica solicitante já foi avisada e vai comentar na consulta de retorno."
    },
    {
      nome: "Perfil lipídico",
      data: "28/10/2026",
      estado: "disponivel",
      solicitante: "Dra. Marina Castelo",
      itens: [
        { nome: "Colesterol total", valor: 188, unidade: "mg/dL", min: 0, max: 190 },
        { nome: "HDL", valor: 52, unidade: "mg/dL", min: 40, max: 999 },
        { nome: "LDL", valor: 112, unidade: "mg/dL", min: 0, max: 130 },
        { nome: "Triglicerídeos", valor: 162, unidade: "mg/dL", min: 0, max: 150 }
      ],
      nota: "Triglicerídeos acima da faixa. Vale conversar sobre alimentação e atividade física na próxima consulta."
    },
    {
      nome: "TSH (tireoide)",
      data: "28/10/2026",
      estado: "disponivel",
      solicitante: "Dra. Sofia Arruda",
      itens: [
        { nome: "TSH", valor: 2.1, unidade: "µUI/mL", min: 0.4, max: 4.0 }
      ],
      nota: "Dentro da faixa de referência."
    },
    {
      nome: "Vitamina D (25-OH)",
      data: "05/11/2026",
      estado: "pendente",
      solicitante: "Dra. Helena Prado",
      itens: [],
      nota: "Material coletado. Resultado previsto para 10/11/2026."
    }
  ],

  /* Histórico de glicemia em jejum para o gráfico (mg/dL). Faixa de referência: 70 a 99. */
  glicemia: {
    min: 70,
    max: 99,
    pontos: [
      { rotulo: "mai", valor: 92 },
      { rotulo: "jun", valor: 95 },
      { rotulo: "jul", valor: 101 },
      { rotulo: "ago", valor: 98 },
      { rotulo: "set", valor: 97 },
      { rotulo: "out", valor: 104 }
    ]
  },

  rotas: {
    carro: {
      tempo: "Cerca de 8 minutos saindo do Terminal Jardim Claro.",
      passos: [
        "Saia do Terminal Jardim Claro pela Rua das Mangueiras, sentido sul.",
        "Siga duas quadras, cruzando a Avenida Central.",
        "Vire à esquerda na Alameda das Figueiras e siga até a Praça dos Ipês.",
        "A clínica fica no número 410, em frente à praça. Estacionamento gratuito na frente, com vagas reservadas."
      ]
    },
    onibus: {
      tempo: "Cerca de 15 minutos, linha fictícia 302 Jardim Claro.",
      passos: [
        "No Terminal Jardim Claro, pegue a linha 302 sentido Mercado Boa Mesa.",
        "Fique na Avenida Central por quatro paradas e desça na parada Rua dos Jatobás.",
        "Caminhe meia quadra pela Rua dos Jatobás até a Alameda das Figueiras.",
        "Vire à direita: a clínica fica logo depois da esquina, com o ponto âmbar na fachada."
      ]
    },
    pe: {
      tempo: "Cerca de 3 minutos a partir da Praça dos Ipês.",
      passos: [
        "Da Praça dos Ipês, atravesse a Alameda das Figueiras pela faixa em frente ao coreto.",
        "A clínica fica bem na frente da praça, no número 410. A entrada tem rampa e porta automática."
      ]
    }
  }
};
