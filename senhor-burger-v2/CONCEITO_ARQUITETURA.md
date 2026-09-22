# Senhor Burger — Protótipo V2

## Status

Reinício do protótipo de experiência a pedido do usuário em 2026-09-21.

A versão anterior continua preservada em `senhor-burger/` como referência histórica. Esta V2 não reutiliza sua arquitetura de bridges/transições.

## O que permanece válido

- cliente, pesquisa e fatos já verificados;
- objetivo principal: pedido online;
- CTA principal: Pedir agora;
- conceito: **“Um burger que ocupa a cena.”**;
- direção: presença, generosidade, desejo e acolhimento;
- baixa densidade visual;
- mobile com composição própria.

## O que foi zerado

- arquitetura de motion da V1;
- clones de objetos entre cenas;
- bridges montados depois da composição;
- transições que surgem apenas na dobra;
- handoffs entre elementos diferentes tentando simular o mesmo objeto.

## Nova regra estrutural

**UM OBJETO → UM OWNER → UMA TIMELINE → VÁRIOS ESTADOS/CENAS.**

Objetos que atravessam cenas vivem em uma `continuity-layer` persistente. As cenas definem estados e alvos, não possuem fisicamente esses objetos.

## Nova sequência do rascunho

### 01 — PRESENÇA

Ideia dominante: o burger ocupa a cena.

Objeto persistente: burger.

Estados: aproximação → abertura controlada das camadas → recomposição → deslocamento para preparar a próxima cena.

### 02 — DESEJO

Ideia dominante: mostrar construção e generosidade sem trocar de produto.

O mesmo burger continua. Nenhum clone e nenhum handoff.

Estados: detalhe → separação curta → recomposição → descida em direção à mesa.

### 03 — A CASA

Ideia dominante: o produto chega à mesa e o ambiente nasce ao redor dele.

O mesmo burger pousa na mesa. O cenário aparece depois do pouso, e não antes.

Elemento preparado para a próxima cena: um recibo/comanda já presente sobre a mesa.

### 04 — PROVA

Ideia dominante: a confiança nasce de algo que já estava na mesa.

A mesma comanda/recibo assume o foco e vira a superfície de prova social. Não existe wipe de tela.

Elemento preparado para a próxima cena: pin de localização dentro da própria peça.

### 05 — LOCALIZAÇÃO

Ideia dominante: o pin deixa a prova e encontra o mapa.

O pin é persistente e viaja até a rota. O mapa existe na cena antes da chegada do pin.

A saída não usa morph arbitrário: o vermelho da rota passa a dominar gradualmente o ambiente enquanto mapa e pin perdem presença.

### 06 — PEDIDO

Ideia dominante: conversão limpa.

A cena entra naturalmente do vermelho construído no final da rota. Sem objeto gigante cobrindo viewport.

CTA principal: Pedir agora.

## Continuidade obrigatória

- burger único entre 01 → 02 → 03;
- recibo único entre 03 → 04;
- pin único entre 04 → 05;
- fundo controlado por uma camada ambiente persistente para evitar seams entre seções;
- um único `requestAnimationFrame` e uma única fonte de verdade para transforms/opacidades dos objetos persistentes;
- posição/escala/opacidade iguais nas fronteiras de cena;
- scroll reverso deve reconstruir exatamente os mesmos estados.

## Objetivo desta fase

Validar somente:

- ritmo;
- continuidade;
- scroll;
- transições;
- reversibilidade;
- composição desktop/mobile/tablet.

Assets finais e refinamento visual ficam para depois da aprovação do rascunho.
