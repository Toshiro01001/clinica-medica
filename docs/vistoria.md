# Vistoria de segurança: Clínica Alameda (site de demonstração)

Data: 08/11/2026. Vistoria feita por mim, Rodrigo Jr, com apoio de ferramenta, sobre o site estático publicado em `https://toshiro01001.github.io/clinica-medica/`.

## Resumo

Site 100% estático, sem servidor próprio, sem banco de dados, sem envio de dados. O único risco real seria alguém confundir a demonstração com uma clínica de verdade, e a faixa permanente no topo, o rodapé e a seção "Como isto funciona" deixam claro que tudo é fictício.

## Content-Security-Policy

Declarada por `<meta http-equiv="Content-Security-Policy">` em `index.html` e `404.html`:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'
```

- Nenhum script inline, nenhum atributo `style`, nenhum `onclick`. Todo comportamento está em `js/app.js` e `js/dados.js`.
- `img-src data:` existe só por causa da seta do `<select>`, desenhada em SVG dentro do CSS.
- `connect-src 'none'`: o site não consegue fazer `fetch`, `XMLHttpRequest` nem WebSocket, nem que alguém injetasse código.
- `form-action 'none'`: mesmo que o JavaScript falhe, nenhum formulário consegue enviar dados para lugar algum.
- `frame-ancestors` não funciona em meta tag (o navegador ignora e avisa no console), por isso foi deixado de fora. Em um site com servidor, iria no cabeçalho HTTP.
- O `404.html` tem `script-src 'none'`: a página de erro não roda script nenhum.

## Envio de dados

Nenhum. Os três formulários (busca, agendamento, login) são interceptados com `preventDefault()` e processados no navegador. Não há analytics, pixel, fonte externa, CDN ou iframe. O único link externo é `https://mileumalinhas.com.br`.

## O que fica no navegador

| Onde | Chave | Quando | Conteúdo | Como apagar |
|---|---|---|---|---|
| `localStorage` | `clinica-alameda-agendamentos` | Só se o visitante marcar "Guardar este agendamento neste navegador" | Lista de agendamentos simulados: código, médico, especialidade, data, hora, nome e convênio digitados pelo visitante. O telefone não é guardado. | Botão "Apagar todos" ou "Cancelar" em cada item, na própria página |
| Memória (variáveis JS) | nenhuma | Durante a visita | Estado do passo a passo e o acesso à área do paciente | Recarregar a página |

Não há cookies, `sessionStorage` nem IndexedDB.

## Área do paciente

O login de demonstração (`paciente.demo` / `demo1234`) está escrito na própria tela e em `js/dados.js`. Isso é intencional: é uma vitrine, não um sistema. Nenhum dado de paciente real existe no repositório; a paciente, os exames e os valores foram inventados. Em um sistema real, a autenticação ficaria no servidor, com senha individual, HTTPS, limite de tentativas e registro de acesso.

## Dependências

Nenhuma em produção. O site usa apenas HTML, CSS e JavaScript escritos à mão e duas fontes locais (Young Serif e Figtree, licença SIL OFL, arquivos de licença em `fonts/`). O Playwright é usado só nos testes, fora do site.

## Dados no repositório

O repositório é público. Conferido: não há senhas reais, chaves de API, tokens, e-mails pessoais, telefones reais ou endereços reais. Telefone e endereço da clínica são fictícios e marcados como tal. O arquivo `google20db0e080e71c701.html` é a verificação de propriedade do Google Search Console do dono do site e não é um segredo.

## Riscos residuais

1. Alguém confundir a demonstração com uma clínica real e tentar marcar consulta. Mitigado pela faixa permanente, pelo texto de cada confirmação ("nenhuma consulta foi marcada de verdade") e pelo rodapé.
2. Dados digitados no agendamento (nome e convênio) ficam no `localStorage` se o visitante pedir. Em aparelho compartilhado, outra pessoa pode ver. Mitigado pelo aviso ao lado da caixa e pelo botão de apagar.
3. Meta tag de CSP não cobre `frame-ancestors`; o site pode ser colocado em um iframe por terceiros. Sem impacto prático, porque não há sessão nem ação sensível a sequestrar.
4. O GitHub Pages serve os cabeçalhos HTTP que quiser; não controlamos HSTS nem cabeçalhos de segurança além do que cabe na meta tag.
