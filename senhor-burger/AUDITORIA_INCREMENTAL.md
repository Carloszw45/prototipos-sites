# Auditoria Incremental — Senhor Burger

## Estado-base

- Versão publicada: v1.0
- Commit-base: `2ee3994b1504b7ed8b72bda32babc0e493ec11ac`
- Regra operacional: um problema por ciclo de correção.
- Após cada correção: publicar imediatamente, revisar HTML/CSS/JS e integração duas vezes; qualquer erro reinicia as duas revisões.
- Só então o item pode ser marcado como validado e o próximo pode começar.
- Próximo item operacional: `SB-010`, porque a auditoria contextual do SB-009 encontrou erro na saída Localização → Pedido; após corrigir SB-010, repetir Prova → Localização → Pedido → Localização → Prova antes de certificar SB-009.

## Estados

- `PENDENTE`: problema identificado, ainda não tratado.
- `EM_CORRECAO`: único problema ativo do ciclo atual.
- `PUBLICADO`: correção já está no GitHub/site; faltam as duas revisões completas ou a certificação contextual foi bloqueada por outro item registrado.
- `VALIDADO`: publicado e aprovado por duas revisões consecutivas sem erro e pela auditoria visual exigida.
- `REABERTO`: regressão ou novo erro encontrado no mesmo ponto; volta ao início.

## Fila atual

| ID | Área | Problema / objetivo | Estado | Commit da correção | Validação |
|---|---|---|---|---|---|
| SB-001 | Hero / mobile | Confirmar densidade, entrada/saída dos textos e sobreposição com o burger nos dois sentidos do scroll. | VALIDADO | `8a1a32126e617700c8c673aa6e4f7bf5deea46ab` | 2 revisões completas de HTML/CSS/JS/integração limpas; auditoria visual 40 estados (20↓/20↑), 20/20 estados de conteúdo idênticos no reverso, 0 overlaps copy/burger |
| SB-002 | Hero → Produtos | Validar continuidade espacial do burger e ausência de salto de escala/posição na dobra. | VALIDADO | `a81b86a22ad2c03b2fcf36fda3430759872ec429` + `97ffcb4613132c690b286f89074cc62c68d8fe13` | reaberto a pedido: removido morph entre burgers; Produtos agora usa a mesma composição de 9 camadas e proporção do Hero; 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; auditoria visual e certificação final em desktop/mobile com 2 ciclos ↓↑ por breakpoint, RMS reverso 0,0, 9 camadas, geometria final coincidente e sem erro de runtime |
| SB-003 | Produtos | Validar entrada/saída dos três estados de copy e recomposição das camadas sem disputa de transform/opacity. | VALIDADO | `e46414a998a7e0a541da7503e9cc747289c2eec3` + cache `ea743e0e5a5c1a3e33778debdc1b8daad5df7ec4` | corrigida sobreposição copy/burger e refinada coreografia das 3 copies, drift e abertura/recomposição das 9 camadas; 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; certificação visual desktop/mobile com 2 ciclos ↓↑ por breakpoint, 324 estados por breakpoint, reversibilidade 0,0, 0 overlaps, 0 competição entre copies e sem erro de runtime |
| SB-004 | Produtos → Casa | Validar escala do burger até a mesa e eliminar qualquer intervalo visual morto ou queda brusca de presença. | VALIDADO | `99957c9f5d0bbef8596b4bd60bb17b23d0318750` + `6c5dc72a8205dff4716d880a7fa8761e4d5b03f4` + `385904fe30da5a5929fc543a2c99f1792003d5d7` + cache `a49052d0ce379280f8e5c8e033ed94776b64c40a` | origem do burger estabilizada; Casa sobe com o scroll; fundo vermelho→marrom contínuo; burger mantido acima da foto e visível até tocar a mesa; copy da Casa removida do bridge para evitar pisca. Após a última correção: 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; 4 auditorias visuais limpas em desktop/mobile, cada uma com 2 ciclos ↓↑ (101/161/181/161 estados por direção; 4.832 estados geométricos no total); reversibilidade métrica 0,0, 0 seams, 0 estados mortos, 0 reversões de trajetória, 0 vazamento da copy e 0 erros de runtime. No contato com a mesa, burger ≈100% desktop e ≈97–98% mobile. |
| SB-005 | Casa | Validar crescimento da fotografia, legibilidade da copy e comportamento reverso sem resíduos. | VALIDADO | `af389c24a6aa6f6d38c541c863d9781a8e76f8f8` + cache `0ee5fd9ab02d183b12242b17cca83f1e06ac6310` | corrigido corte da copy no mobile: composição ancorada pelo rodapé e tipografia mobile levemente reduzida; desktop preservado. 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas. 4 auditorias visuais independentes com dois ciclos ↓↑ por viewport, cobrindo desktop e mobiles de 320×568 a 430×932; 5.328 estados avaliados no total, reversibilidade 0,0, 0 clipping, 0 NaN, crescimento da foto monotônico e 0 erros de runtime. |
| SB-006 | Casa → Prova | Validar expansão de luz/janela sem cobrir o conteúdo da próxima cena nem gerar tela lavada. | VALIDADO | `7626f7dc5a94565624f7ccdba2f5ab01d6cc5b46` + `33d08b00848a76aa34230fdfe2f1b89124e3a735` + cache `2574c8b1c1d6c87f6af9c7e116da4caba8699a20` | corrigido washout no handoff: fundo da Casa migra para creme, foto sai antes e camada de luz recua antes do frame final. Corrigido também o salto do 4,7: clone passa a usar a geometria real do rating da Prova. Após a última correção: 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; 4 auditorias visuais independentes, cada viewport com 101 posições × ↓↑↓↑, cobrindo 1440×900, 390×844, 1366×768, 412×915, 1536×864, 360×800, 1280×720 e 430×932; 3.232 estados avaliados, reversibilidade 0,0, 0 seams, 0 washout final, 0 reversões de opacidade e 0 erros de runtime. Desvio máximo do handoff do algarismo 4: 0,39 px. |
| SB-007 | Prova | Validar entrada/saída do 4,7 e reviews, inclusive subida do scroll, sem sumiços prematuros. | VALIDADO | `755fc89f48fd7c79cc6f592f4415064fa821bef8` + cache `76e48efa50830455f18e0e6dc0e039902e3f43b5` | corrigida sobreposição entre reviews: janelas separadas em p=.50 e saída vertical contextual; 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; 4 auditorias visuais independentes cobrindo 1440×900, 390×844, 1366×768, 412×915, 1536×864, 360×800, 1280×720 e 430×932; 5.472 estados avaliados; reversibilidade 0,0, 0 sobreposições, 0 clipping, 0 NaN, 0 erros de runtime e RMS amostral 0,0. |
| SB-008 | Prova → Localização | Validar estrela → pin e transição creme → escuro sem faixa/corte horizontal perceptível. | VALIDADO | `1283dcc2cb2dbb43429a9dee0266425ad5671321` + cache `b19af0843f8ff34ec76b52b0ed5eb287ab4b26be` + `acb9c7b55b0130af93d7111e73eb759ee634db30` + cache `a639e0d34fbf2abb0bfe2b80c90363f616d5b91c` | corrigida origem geométrica do 4,7/estrela: clone passa a nascer da geometria real estabilizada da Prova, sem acompanhar a seção durante a subida. Corrigido também o handoff final do pin/mapa: pin permanece visível na dobra, mapa termina com a mesma opacidade da cena real e a rota deixa de ser pré-desenhada antes da hora. 2 revisões completas + 2 revisões finais de HTML/CSS/JS/integração limpas; 4 auditorias visuais independentes cobrindo 1440×900, 390×844, 1366×768, 412×915, 1536×864, 360×800, 1280×720 e 430×932; 5.472 estados avaliados; reversibilidade visual 0,0, RMS amostral 0,0, 0 reversões da trajetória da estrela, 0 seams horizontais, 0 erros de runtime. Desvio máximo da origem do rating: 0,008 px; desvio máximo do pin no handoff: 0,39 px. |
| SB-009 | Localização | Validar desenho da rota, pin, título/endereço e reversibilidade completa. | PUBLICADO | `e8044dc508c1fc97524467508c31ea21916a7e51` | corrigida hierarquia de camadas: rota passa atrás de `NOVA CONTAGEM`, preservando leitura sem alterar geometria. 2 revisões de HTML/CSS/JS/integração limpas; auditoria contextual pós-correção em 1440×900 e 390×844, 101 estados por direção × 2 ciclos por viewport, reversibilidade 0,0, 0 overlaps de título/meta/label, 0 reversões da rota e 0 erros de runtime. Certificação contextual final bloqueada pelo SB-010: saída para Pedido apresenta faixa horizontal e sobreposição simultânea entre títulos. |
| SB-010 | Localização → Pedido | Corrigir faixa/corte horizontal perceptível na troca escuro → vermelho e sobreposição simultânea `NOVA CONTAGEM` / `ESCOLHA O SEU.`; validar mapa → vermelho final e entrada do CTA sem objeto arbitrário nem troca brusca de fundo. | PENDENTE | — | problema confirmado durante auditoria contextual do SB-009 |
| SB-011 | Pedido | Validar entrada do burger final, CTA, links e saída para footer. | PENDENTE | — | — |
| SB-012 | Conteúdo / função | Revisar textos vagos e links ainda provisórios (`#pedido`, Instagram/Cardápio) para separar protótipo de comportamento final. | PENDENTE | — | — |
| SB-013 | Integração | Revisar conflitos entre CSS e JS sobre `transform`, `opacity`, `background`, z-index e estados sticky/fixed. | PENDENTE | — | — |
| SB-014 | Mobile / tablet / desktop | Auditoria comparativa de composição e transições por breakpoint; mobile não pode ser desktop reduzido. | PENDENTE | — | — |
| SB-015 | Continuidade entre cenas / zero-jump | Auditoria global de todas as dobras: localizar clones/reparent/handoffs desnecessários, saltos de posição/escala, microtravadas e ownership duplicado. Sempre que viável, substituir troca entre elementos por objeto persistente com um único owner/timeline e exigir continuidade exata nos dois sentidos. | PENDENTE | — | — |

## Procedimento por item

1. Marcar apenas um item como `EM_CORRECAO`.
2. Corrigir somente esse problema e o mínimo necessário para evitar regressão.
3. Publicar imediatamente no GitHub/site.
4. Registrar o commit e marcar `PUBLICADO`.
5. Revisar HTML completo, CSS completo, JavaScript completo e integração — passagem 1.
6. Repetir a revisão completa — passagem 2.
7. Se qualquer erro surgir, corrigir, publicar e reiniciar as duas passagens do zero.
8. Com duas passagens consecutivas limpas, executar a auditoria visual contextual exigida.
9. Se a auditoria contextual descobrir erro em uma transição adjacente, registrar esse item como dependência operacional e corrigi-lo em ciclo próprio antes da certificação contextual final.
10. Só depois da certificação contextual limpa marcar `VALIDADO`.

## Regra de continuidade

Ao retomar o projeto em outro turno/conversa, ler este arquivo primeiro. Não confiar apenas no histórico do chat. Quando houver `Próximo item operacional` explícito por dependência contextual, ele prevalece sobre a simples ordem numérica da fila.
