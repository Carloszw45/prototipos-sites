# Auditoria Incremental — Senhor Burger

## Estado-base

- Versão publicada: v1.0
- Commit-base: `2ee3994b1504b7ed8b72bda32babc0e493ec11ac`
- Regra operacional: um problema por ciclo de correção.
- Após cada correção: publicar imediatamente, revisar HTML/CSS/JS e integração duas vezes; qualquer erro reinicia as duas revisões.
- Só então o item pode ser marcado como validado e o próximo pode começar.

## Estados

- `PENDENTE`: problema identificado, ainda não tratado.
- `EM_CORRECAO`: único problema ativo do ciclo atual.
- `PUBLICADO`: correção já está no GitHub/site; faltam as duas revisões completas.
- `VALIDADO`: publicado e aprovado por duas revisões consecutivas sem erro.
- `REABERTO`: regressão ou novo erro encontrado no mesmo ponto; volta ao início.

## Fila atual

| ID | Área | Problema / objetivo | Estado | Commit da correção | Validação |
|---|---|---|---|---|---|
| SB-001 | Hero / mobile | Confirmar densidade, entrada/saída dos textos e sobreposição com o burger nos dois sentidos do scroll. | PUBLICADO | `f2cab7fc0a06d9852deaf181b13dff4bba3cd56b` | auditoria visual específica: 40 estados, sem overlap; revisão de código 1 pendente |
| SB-002 | Hero → Produtos | Validar continuidade espacial do burger e ausência de salto de escala/posição na dobra. | PENDENTE | — | — |
| SB-003 | Produtos | Validar entrada/saída dos três estados de copy e recomposição das camadas sem disputa de transform/opacity. | PENDENTE | — | — |
| SB-004 | Produtos → Casa | Validar escala do burger até a mesa e eliminar qualquer intervalo visual morto ou queda brusca de presença. | PENDENTE | — | — |
| SB-005 | Casa | Validar crescimento da fotografia, legibilidade da copy e comportamento reverso sem resíduos. | PENDENTE | — | — |
| SB-006 | Casa → Prova | Validar expansão de luz/janela sem cobrir o conteúdo da próxima cena nem gerar tela lavada. | PENDENTE | — | — |
| SB-007 | Prova | Validar entrada/saída do 4,7 e reviews, inclusive subida do scroll, sem sumiços prematuros. | PENDENTE | — | — |
| SB-008 | Prova → Localização | Validar estrela → pin e transição creme → escuro sem faixa/corte horizontal perceptível. | PENDENTE | — | — |
| SB-009 | Localização | Validar desenho da rota, pin, título/endereço e reversibilidade completa. | PENDENTE | — | — |
| SB-010 | Localização → Pedido | Validar mapa → vermelho final e entrada do CTA sem objeto arbitrário nem troca brusca de fundo. | PENDENTE | — | — |
| SB-011 | Pedido | Validar entrada do burger final, CTA, links e saída para footer. | PENDENTE | — | — |
| SB-012 | Conteúdo / função | Revisar textos vagos e links ainda provisórios (`#pedido`, Instagram/Cardápio) para separar protótipo de comportamento final. | PENDENTE | — | — |
| SB-013 | Integração | Revisar conflitos entre CSS e JS sobre `transform`, `opacity`, `background`, z-index e estados sticky/fixed. | PENDENTE | — | — |
| SB-014 | Mobile / tablet / desktop | Auditoria comparativa de composição e transições por breakpoint; mobile não pode ser desktop reduzido. | PENDENTE | — | — |

## Procedimento por item

1. Marcar apenas um item como `EM_CORRECAO`.
2. Corrigir somente esse problema e o mínimo necessário para evitar regressão.
3. Publicar imediatamente no GitHub/site.
4. Registrar o commit e marcar `PUBLICADO`.
5. Revisar HTML completo, CSS completo, JavaScript completo e integração — passagem 1.
6. Repetir a revisão completa — passagem 2.
7. Se qualquer erro surgir, corrigir, publicar e reiniciar as duas passagens do zero.
8. Com duas passagens consecutivas limpas, marcar `VALIDADO`.
9. Só então selecionar o próximo item.

## Regra de continuidade

Ao retomar o projeto em outro turno/conversa, ler este arquivo primeiro. Não confiar apenas no histórico do chat. O primeiro item não validado define o próximo trabalho.
