# Auditoria — Senhor Burger V2

## Estado-base

- Protótipo reiniciado do zero em `senhor-burger-v2/`.
- A versão anterior permanece preservada em `senhor-burger/`.
- Arquitetura V2: objetos persistentes em `continuity-layer`, sem clones/bridges entre cenas.
- Commits-base:
  - arquitetura: `2beb0dec7369cb43919a2c3b2026e3224b293866`
  - HTML: `7289ea09671239cdfe72adfcef4f50eb41922a71`
  - CSS: `436ff8fa4d31fac6d652dfb8ba028568c3b7d19a`
  - JS/timeline: blob `5b16d48537e67f607c66aa429533dbdcd59fa85a` antes do V2-010

## Regra operacional

Auditar contexto completo. Se um problema aparecer, registrar e corrigir um por ciclo, publicar imediatamente e reiniciar a validação.

## Observação pré-baseline

Durante a primeira renderização local foi identificado um período visual morto em Localização → Pedido. A arquitetura foi corrigida antes do baseline publicado: mapa/título permanecem até a saída física da cena, o pin acompanha a saída e o Pedido começa a entrar durante a liberação da Localização.

## Fila

| ID | Área | Objetivo | Estado | Commit | Validação |
|---|---|---|---|---|---|
| V2-001 | Presença → Desejo | Certificar burger único, continuidade C0/C1 e reverso. | PENDENTE | — | — |
| V2-002 | Desejo → Casa | Certificar descida/pouso do mesmo burger e nascimento do ambiente ao redor. | PENDENTE | — | — |
| V2-003 | Casa → Prova | Corrigir entrada precoce da comanda que disputava espaço com a copy da Casa; certificar comanda única da mesa até a prova. | PUBLICADO | `9469c6ec62fe3ff64b0afdfd03589dcd95790929` + sync `6d456c6b9b724bdd28bd8a90b5622292568e3be2` | 2 passagens de código limpas; A1/A2 com 0 overlap copy/comanda e reversibilidade 0. Certificação global segue bloqueada por itens posteriores. |
| V2-004 | Prova → Localização | Certificar pin único saindo da prova e chegando ao mapa. | PENDENTE | — | — |
| V2-005 | Localização → Pedido | Certificar saída física do mapa + pin e entrada contínua do Pedido sem período morto. | PENDENTE | — | correção pré-baseline já incorporada |
| V2-006 | Cenas / conteúdo | Certificar legibilidade, densidade, progressão e ausência de telas mortas. | PENDENTE | — | — |
| V2-007 | Mobile / tablet / desktop | Certificar composições próprias e ausência de clipping/overflow. | PENDENTE | — | — |
| V2-008 | Integração | Certificar HTML/CSS/JS, resize, reversibilidade, console e ownership único. | PENDENTE | — | — |
| V2-009 | Casa / mobile | Eliminar sobreposição perceptível do burger persistente com a copy da Casa sem quebrar o pouso na mesa ou o handoff para a comanda. | VALIDADO | `a5a4e2bef060e20ff3a7501a2324cd1fd13b29ab` | 2 revisões integrais limpas; 2 auditorias mobile independentes (390×844 e 412×915), ↓↑↓↑, reversibilidade 0, zero overlap burger/copy e copy/comanda, zero overflow/runtime. Folha de contato confirma burger → copy → comanda. |
| V2-010 | Casa / desktop | Eliminar interseção geométrica do burger com a copy da Casa em estados intermediários, preservando pouso, presença e continuidade Desejo → Casa. | EM_CORRECAO | — | confirmado em 1440×900 e 1366×768 |

## Próximo passo

Corrigir somente V2-010, publicar imediatamente e reiniciar a validação completa do zero.
