# Identidade visual: Clínica Alameda

Estudo curto feito antes de qualquer linha de código. Tudo aqui é fictício: a clínica, as pessoas, o endereço, os convênios e os resultados de exame.

## Nome e posicionamento

**Clínica Alameda.** Clínica médica de bairro com várias especialidades sob o mesmo teto.

Frase de posicionamento: **"Cuidado organizado, do agendamento ao resultado."**

A ideia que guia tudo: uma clínica que acolhe sem ser melosa e organiza sem ser fria. A "alameda" é uma rua arborizada, calma, onde se sabe exatamente onde fica cada coisa. Por isso o elemento central do site é a **planta da clínica**: cada sala é uma especialidade, e o visitante entende a casa antes de entrar. A planta fica na seção "Especialidades e médicos", logo acima da busca; a abertura é uma foto.

## Paleta

Fugimos do verde-hospital e do azul-clínico de propósito. A base é um lilás quase cinza (calmo, limpo, nada de consultório), a cor de identidade é uma ameixa profunda (séria, acolhedora, adulta) e o único ponto quente é um âmbar (a "luz acesa" da sala, o lugar para onde o olho vai).

| Nome | Hex | Papel |
|---|---|---|
| Névoa | `#F4F1F5` | Fundo da página. Lilás acinzentado, quase branco. |
| Branco | `#FFFFFF` | Superfícies (cartões, formulários, planta). |
| Ameixa | `#3B2A48` | Títulos, cabeçalho, rodapé, botões secundários. Cor de identidade. |
| Tinta | `#27212E` | Texto corrente. |
| Lavanda | `#DCD0E6` | Apoio: fundos de blocos, bordas, salas da planta, etiquetas. |
| Âmbar | `#E2A233` (preenchimento) e `#7A4A05` (texto/links) | Destaque. Botão principal, sala selecionada, marcador "você está aqui" no mapa. |

Regra de uso do destaque: **o âmbar aparece em um só lugar por tela** (o botão principal da seção ou o item selecionado). Nunca dois botões âmbar na mesma dobra. O âmbar de preenchimento recebe texto Ameixa; o âmbar de texto (`#7A4A05`) só é usado sobre fundos claros, para garantir contraste AA.

Há ainda um tom secundário de texto, **Ameixa clara** `#5E4D6B`, para legendas e textos de apoio (7,6:1 sobre Branco, 5,6:1 sobre Névoa).

Contrastes verificados (WCAG): Tinta sobre Névoa 13,9:1; Ameixa sobre Névoa 11,6:1; Ameixa sobre Âmbar 5,9:1; Âmbar-texto sobre Névoa 6,7:1; Névoa sobre Ameixa 11,6:1; Ameixa sobre Lavanda 8,8:1.

## Tipografia

Duas famílias, ambas locais em `fonts/` (licença SIL OFL, arquivo de licença ao lado).

- **Young Serif** (peso único, 400): títulos. Serifa de olho grande, redonda e de baixo contraste; parece a letra de uma placa de latão bem feita. Dá o acolhimento sem cair no "serif de revista".
- **Figtree** (variável, 300 a 900): texto corrente, formulários, botões e etiquetas. Humanista, aberta, excelente em telas pequenas.

Escala tipográfica (fluida, com `clamp`):

| Papel | Família | Tamanho | Entrelinha | Peso |
|---|---|---|---|---|
| Título da página (h1) | Young Serif | 2,25rem a 3,5rem | 1,08 | 400 |
| Título de seção (h2) | Young Serif | 1,75rem a 2,25rem | 1,15 | 400 |
| Subtítulo (h3) | Young Serif | 1,25rem | 1,3 | 400 |
| Corpo | Figtree | 1,0625rem (17px) | 1,6 | 400 |
| Interface (botões, rótulos) | Figtree | 0,9375rem | 1,3 | 600 |
| Legenda | Figtree | 0,875rem | 1,45 | 400 |

Regra de peso: títulos nunca são negrito (a Young Serif só tem um peso, e isso é proposital). No corpo, o 600 é o peso máximo, reservado a rótulos e botões. Nada de 700 ou 800 em texto.

## Layout

- Grade de 12 colunas, largura máxima de 1120px, margens laterais de 20px no celular e 40px no computador.
- Ritmo de espaçamento em múltiplos de 8px (8, 16, 24, 32, 48, 64, 96).
- Seções separadas por 96px no computador e 64px no celular, sem linhas divisórias; a mudança de fundo (Névoa / Branco / Ameixa) marca a mudança de assunto.
- Texto alinhado à esquerda em todo o site. Nada centralizado, exceto o conteúdo dentro de botões.
- Cada seção abre com h2 e uma frase que diz o que é e o que fazer.
- Cantos arredondados de 12px em cartões e 8px em campos; raio de 999px só em etiquetas pequenas.
- Sombras: nenhuma. A separação é feita por borda Lavanda de 1px ou por mudança de fundo.
- Celular primeiro: tudo em uma coluna a partir de 320px, duas colunas a partir de 720px, grade completa a partir de 1024px.

## Imagem forte

O hero é uma **foto gerada por IA (Canva)**, ilustrativa: a recepção de uma clínica, com uma parede cor de ameixa, um balcão de madeira clara com dois monitores, poltronas lilás com pés de madeira, plantas, um quadro abstrato em tons de lilás, um pendente âmbar aceso e uma janela grande com árvores ("alameda") do lado de fora. As cores da foto são as da paleta (Ameixa, Lavanda, Âmbar), então ela parece parte da marca. Não há pessoas.

O contêiner tem proporção fixa de 4:3 e cantos de 12 px, como os cartões do site, sem sombra. Enquanto a foto carrega, ele mostra a cor média dela.

A **planta baixa em SVG** (cada sala é uma especialidade; a recepção tem um ponto âmbar "você está aqui"; clicar em uma sala leva à busca já filtrada) deixou o hero e passou para o topo da seção "Especialidades e médicos", onde continua funcionando do mesmo jeito. Ela reaparece pequena no mapa de como chegar. A animação em que as salas acendiam em sequência foi retirada, porque a planta não fica mais na primeira tela.

Nada de foto de banco de imagem, nada de pessoa, nada de estetoscópio.

### Foto do hero

- **Arquivo**: `img/hero.webp`, 1440 x 1080 px, proporção 4:3.
- **Origem**: gerada por IA no Canva. O README e este estudo avisam que é ilustrativa.
- **Prompt resumido**: "Recepção de uma clínica médica moderna e acolhedora: parede ao fundo na cor ameixa, balcão de recepção de carvalho claro com fita de luz âmbar na base, dois monitores, poltronas lilás-acinzentado com pés de madeira, vasos com plantas, quadro abstrato em tons de lilás e bege, pendente de vidro âmbar aceso, grande janela com árvores lá fora, piso claro com luz de fim de tarde. Estilo editorial de site premium, sem texto, sem pessoas, proporção 4:3."
- **Texto alternativo**: descreve a recepção, o balcão, as poltronas, as plantas, o quadro, o pendente e a janela.
- **Texto do hero**: fica ao lado da foto no computador e abaixo dela no celular, nunca por cima. O contraste do texto é o da página (Ameixa e Tinta sobre Névoa) e não depende da foto.

## Movimento

- Um só momento orquestrado na abertura: a foto do hero aparece com um fade de 900ms.
- Respostas a ações: sala em foco/hover ganha borda Ameixa; horário selecionado vira âmbar; resultados de busca aparecem com fade de 150ms.
- Com `prefers-reduced-motion: reduce`, nenhuma animação roda: a foto já aparece pronta e as transições viram instantâneas.

## O que evitamos de propósito

Fundo creme com terracota, preto com verde ácido, cartões iguais com sombra, rótulos em caixa alta sobre todo título, numeração 01/02/03 sem sequência real, setas em links, gradientes decorativos. Os únicos números em sequência do site são os passos do agendamento, que são de fato uma sequência.

## Design systems aplicados (leva final)

Dupla escolhida no catálogo da Mil e Uma Linhas!: **oemsz26-design-system** (claro, o sistema de saúde e painel do paciente: cartões brancos com anel de 1px e sombra em seis passos, linhas de lista com tile de ícone, pílulas de estado, faixa de dias, gráfico de linha com pontos destacados) e **vesper-design-system** (escuro: vidro a 80% com blur de 8px, linhas de consentimento com interruptor, botões ghost com hairline a 50%, rodapé em colunas, entrada com desfoque e orbe de luz). A paleta não mudou.

**Como foram misturados.** As seções claras (#especialidades, #paciente, #como-chegar, #como-funciona) usam os padrões do oemsz26 trocando o cinza-pedra por Névoa e Lavanda, o pedra-900 por Ameixa, e deixando o âmbar só no item selecionado ou no botão principal; a sombra em seis passos fica a 3% (quase invisível, para respeitar a regra de nenhuma sombra). A faixa Ameixa (#agendar) e o rodapé usam os padrões do vesper com Ameixa no lugar do preto: vidro a 80% com blur no cabeçalho ao rolar, passos como linhas arredondadas com borda a 10%, botão ghost com hairline Névoa a 50%, rodapé em colunas com cabeçalhos pequenos em caixa alta; a cena 3D do vesper virou uma mancha radial Lavanda a 8% em canvas 2D, desenhada uma vez.

Componentes aplicados (padrão, origem, onde):

- Card com anel e sombra em seis passos (oemsz26): `.busca`, `.medico` (linhas da busca), `.login`, `.dica`, `.painel-topo`, `.painel-exames`, `.painel-grafico`.
- Goal row / Friend row (oemsz26): cada médico em `#busca-lista` é uma linha com tile de 40px Lavanda com a inicial da especialidade em Young Serif, nome em Figtree 600, legenda e pílulas no fim da linha.
- Status pill (oemsz26): convênios em `.medico-lista` (12px, peso 500, Ameixa sobre Lavanda a 60%; o convênio filtrado fica Ameixa com texto Névoa) e a etiqueta "Atende sábado".
- Week strip (oemsz26): `#cal-grade`, dias como pílulas de 44px e raio 12px; disponível com anel Lavanda a 40% sobre Ameixa clara, selecionado em Âmbar com texto Ameixa, indisponível a 35%.
- Line chart com pontos destacados e tooltip (oemsz26): `svg#grafico`, linha Ameixa de 2px com curva suave, faixa de referência Lavanda a 30%, pontos de raio 4 com borda branca (fora da faixa em Âmbar) e tooltip Tinta ao passar o mouse, tocar ou focar.
- Hero photo with ink scrim (oemsz26): `.hero-foto-caixa` com véu Ameixa a 70% vindo de baixo e a legenda "Recepção · Alameda das Figueiras, 410".
- Primary pill com seta + Play button com anel (oemsz26): `.botao-principal` (Âmbar, raio 12px, seta de 12px que anda 4px no hover) e `.botao-icone` do calendário (discos brancos de 44px com anel Lavanda e sombra média).
- Gradient ring (oemsz26): `.exames-resumo` no topo de `.painel-exames`, anel de 96px (Lavanda, Ameixa clara, Âmbar) com disco branco e o total de valores dentro da faixa, calculado dos dados.
- Glass header (vesper): `.topo.esta-rolado`, Ameixa a 80% com blur de 8px e hairline Lavanda a 10% depois de 20px de rolagem, transição de 300ms.
- Consent rows + switch (vesper): `.passo` (raio 10px, fundo Ameixa clara a 60%, borda Névoa a 10%, "Passo N" em caixa alta 12px, bloqueado a 55%) e `.marcar` com interruptor de 44 por 24px.
- Ghost button (vesper): `.botao-secundario` dentro de `.secao-escura`, `#meus-apagar` e os botões "Cancelar" dos agendamentos guardados.
- Data display com filete à esquerda (vesper): `.hero-fatos` (filete Ameixa a 80%, valor em Young Serif 24px, rótulo em Figtree 14px) e `.painel-fato` na área do paciente (filete Lavanda).
- Footer columns (vesper): `.rodape-grade` em três colunas com cabeçalhos em caixa alta e links Névoa a 70%.
- Blur-in type + revelação ao rolar + orbe em canvas 2D (vesper): `#hero-titulo` entra de blur 8px em 700ms; `.funciona-bloco`, `.medico` e `.passo` sobem 12px com fade em 500ms e escada de 80ms; `#agendar-orbe` desenha a mancha radial uma vez. Tudo desligado com `prefers-reduced-motion`.

**Fotos novas.** Seis lugares de foto foram criados, todos com a imagem final gerada por IA no Canva em `img/`: `consultorio-maca.webp` (4:3), `sala-espera-poltronas.webp` (4:5), `corredor-consultorios.webp` (3:2), `bancada-exames.webp` (1:1), `medica-janela.webp` (3:4, oculta abaixo de 720px) e `fachada-alameda.webp` (16:9). Nenhuma mostra rosto; são ilustrativas.
