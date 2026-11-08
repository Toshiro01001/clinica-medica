# Identidade visual: Clínica Alameda

Estudo curto feito antes de qualquer linha de código. Tudo aqui é fictício: a clínica, as pessoas, o endereço, os convênios e os resultados de exame.

## Nome e posicionamento

**Clínica Alameda.** Clínica médica de bairro com várias especialidades sob o mesmo teto.

Frase de posicionamento: **"Cuidado organizado, do agendamento ao resultado."**

A ideia que guia tudo: uma clínica que acolhe sem ser melosa e organiza sem ser fria. A "alameda" é uma rua arborizada, calma, onde se sabe exatamente onde fica cada coisa. Por isso o elemento central do site é a **planta da clínica**: cada sala é uma especialidade, e o visitante entende a casa antes de entrar.

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

A imagem do hero é uma **planta baixa da clínica em SVG**, desenhada à mão em código. Cada sala tem o nome da especialidade; a recepção tem um ponto âmbar ("você está aqui"). As salas são botões: clicar em uma leva à busca já filtrada por aquela especialidade. A planta também reaparece pequena no rodapé do mapa de como chegar, fechando o ciclo.

Nada de foto de banco de imagem, nada de pessoa, nada de estetoscópio. A organização é a imagem.

## Movimento

- Um só momento orquestrado na abertura: as salas da planta "acendem" em sequência (opacidade e leve escala, 60ms de intervalo entre elas), e o ponto âmbar da recepção pulsa duas vezes e para.
- Respostas a ações: sala em foco/hover ganha borda Ameixa; horário selecionado vira âmbar; resultados de busca aparecem com fade de 150ms.
- Com `prefers-reduced-motion: reduce`, nenhuma animação roda: a planta já aparece pronta e as transições viram instantâneas.

## O que evitamos de propósito

Fundo creme com terracota, preto com verde ácido, cartões iguais com sombra, rótulos em caixa alta sobre todo título, numeração 01/02/03 sem sequência real, setas em links, gradientes decorativos. Os únicos números em sequência do site são os passos do agendamento, que são de fato uma sequência.
