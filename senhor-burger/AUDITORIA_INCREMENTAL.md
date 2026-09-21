# Auditoria Incremental — Senhor Burger

## Estado-base

- Versão publicada: v1.0
- Commit-base: `2ee3994b1504b7ed8b72bda32babc0e493ec11ac`
- Regra operacional: um problema por ciclo de correção.
- Após cada correção: publicar imediatamente, revisar HTML/CSS/JS e integração duas vezes; qualquer erro reinicia a validação.
- Certificação visual contextual: para a cena N, iniciar em N-1, atravessar N, chegar a N+1 e repetir no sentido inverso.
- Próximo item operacional: `SB-012 — Conteúdo / função`.

## Estados

- `PENDENTE`: ainda não tratado.
- `EM_CORRECAO`: único problema ativo.
- `PUBLICADO`: correção publicada; validação ainda incompleta.
- `VALIDADO`: correção publicada + código + auditoria visual exigida aprovados.
- `REABERTO`: regressão encontrada; reinicia o ciclo.

## Fila atual

| ID | Área | Problema / objetivo | Estado | Commit da correção | Validação |
|---|---|---|---|---|---|
| SB-001 | Hero / mobile | Densidade, copy e burger nos dois sentidos. | VALIDADO | `8a1a32126e617700c8c673aa6e4f7bf5deea46ab` | 2 revisões completas limpas; auditoria visual reversa limpa, 0 overlaps copy/burger. |
| SB-002 | Hero → Produtos | Continuidade espacial do burger. | VALIDADO | `a81b86a22ad2c03b2fcf36fda3430759872ec429` + `97ffcb4613132c690b286f89074cc62c68d8fe13` | removido morph; mesma composição de 9 camadas; certificação desktop/mobile limpa e reversível. |
| SB-003 | Produtos | Três copies + abertura/recomposição do burger. | VALIDADO | `e46414a998a7e0a541da7503e9cc747289c2eec3` + cache `ea743e0e5a5c1a3e33778debdc1b8daad5df7ec4` | 2+2 revisões limpas; 0 overlaps/competição e reversibilidade 0,0. |
| SB-004 | Produtos → Casa | Burger até a mesa, sem intervalo morto. | VALIDADO | `99957c9f5d0bbef8596b4bd60bb17b23d0318750` + `6c5dc72a8205dff4716d880a7fa8761e4d5b03f4` + `385904fe30da5a5929fc543a2c99f1792003d5d7` + cache `a49052d0ce379280f8e5c8e033ed94776b64c40a` | origem estabilizada; fundo vermelho→marrom contínuo; 4.832 estados, reversibilidade 0,0, 0 seams/dead states/runtime. |
| SB-005 | Casa | Foto, copy e reversibilidade. | VALIDADO | `af389c24a6aa6f6d38c541c863d9781a8e76f8f8` + cache `0ee5fd9ab02d183b12242b17cca83f1e06ac6310` | corrigido corte da copy mobile; 5.328 estados, 0 clipping/NaN/runtime, reversibilidade 0,0. |
| SB-006 | Casa → Prova | Luz/janela e handoff do 4,7. | VALIDADO | `7626f7dc5a94565624f7ccdba2f5ab01d6cc5b46` + `33d08b00848a76aa34230fdfe2f1b89124e3a735` + cache `2574c8b1c1d6c87f6af9c7e116da4caba8699a20` | washout eliminado; rating usa geometria real; 3.232 estados, desvio máximo 0,39 px. |
| SB-007 | Prova | Entrada/saída das reviews. | VALIDADO | `755fc89f48fd7c79cc6f592f4415064fa821bef8` + cache `76e48efa50830455f18e0e6dc0e039902e3f43b5` | reviews não se sobrepõem; 5.472 estados, RMS/reversibilidade 0,0. |
| SB-008 | Prova → Localização | Estrela → pin e creme → escuro. | VALIDADO | `1283dcc2cb2dbb43429a9dee0266425ad5671321` + `acb9c7b55b0130af93d7111e73eb759ee634db30` + cache final `a639e0d34fbf2abb0bfe2b80c90363f616d5b91c` | origem do rating/estrela estabilizada; pin/mapa contínuos; 5.472 estados, 0 seams/runtime; pin max 0,39 px. |
| SB-009 | Localização | Rota, pin, título/endereço e reversibilidade. | VALIDADO | `e8044dc508c1fc97524467508c31ea21916a7e51` | rota passa atrás de `NOVA CONTAGEM`; após correções adjacentes SB-010/SB-011, percurso contextual Prova → Localização → Pedido → Localização → Prova repetido em 8 viewports; 3.872 estados, 0 overlap, 0 seam/background mismatch, 0 overflow, reversibilidade 0,0 e 0 runtime. |
| SB-010 | Localização → Pedido | Eliminar faixa escuro→vermelho e coexistência dos títulos. | VALIDADO | `812f89f61e1ba7a7d3383a06d7fe602852265c75` + cache `78bfda2f1eed8a08cf4449d75c2999d18a11e524` | fundo compartilhado contínuo entre as duas cenas; saída de `NOVA CONTAGEM` termina antes da entrada de `ESCOLHA O SEU.`. Uma publicação intermediária teve erro de sintaxe e foi imediatamente supersedida antes da validação. Após correção: 4 auditorias contextuais em 8 viewports, 3.872 estados, 0 faixa, 0 coexistência, reversibilidade 0,0, 0 runtime. |
| SB-011 | Pedido | Burger final, CTA, links e saída para footer. | VALIDADO | `7c831b5249b273dcb77202e27321cef93d8fc4cc` + cache `9a6f2fdd5c4e5477c034899156f762f2de837466` | corrigido corte do título mobile com `clamp(58px,18vw,82px)`. Auditoria contextual Localização → Pedido → Footer → Pedido → Localização, com burger real de 9 camadas, em desktop/mobile e certificação extra; 0 overflow do título, 0 perda crítica do burger, 0 conflito com footer, reversibilidade 0,0 e 0 runtime. Links continuam provisórios e pertencem ao SB-012. |
| SB-012 | Conteúdo / função | Revisar textos vagos e links provisórios (`#pedido`, Instagram/Cardápio) e separar protótipo de comportamento final. | PENDENTE | — | — |
| SB-013 | Integração | Conflitos CSS/JS sobre transform, opacity, background, z-index e sticky/fixed. | PENDENTE | — | — |
| SB-014 | Mobile / tablet / desktop | Auditoria comparativa por breakpoint; mobile não pode ser desktop reduzido. | PENDENTE | — | — |
| SB-015 | Continuidade entre cenas / zero-jump | Auditoria global de clones/handoffs, ownership, saltos e microtravadas; migrar para objeto persistente quando viável. | PENDENTE | — | — |

## Estado técnico atual

- `index.html`: `style.css?v=103`, `script.js?v=112`
- SHA index: `d035ac631cac0e23c281378cba7ac04c780a7bde`
- SHA CSS: `e06b8138061d43cebf1405e68f05346f887f8639`
- SHA JS: `11882bb11ecac175413a18ba39e9a7c4e5eb26ec`

## Procedimento por item

1. Marcar um único item como `EM_CORRECAO`.
2. Corrigir somente esse problema.
3. Publicar imediatamente.
4. Reiniciar validação.
5. Duas revisões completas de HTML/CSS/JS/integração.
6. Auditoria visual contextual: N-1 → N → N+1 → N → N-1, ida/volta conforme protocolo.
7. Qualquer erro: corrigir, publicar e reiniciar.
8. Com zero erros, executar certificação final extra.
9. Só então marcar `VALIDADO` e avançar.

## Regra de continuidade

Ao retomar em outro turno/conversa, ler este arquivo primeiro. O primeiro item não validado — salvo dependência contextual registrada — define o próximo trabalho.
