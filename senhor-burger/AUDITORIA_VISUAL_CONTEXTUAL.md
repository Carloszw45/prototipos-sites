# Auditoria Visual Contextual — Senhor Burger

## Regra obrigatória

A auditoria visual de uma cena não pode começar diretamente dentro dela quando o objetivo for certificar fluidez, continuidade ou transições.

Para uma cena-alvo N, o percurso oficial é:

CENA N-1 → TRANSIÇÃO DE ENTRADA → CENA N → TRANSIÇÃO DE SAÍDA → CENA N+1

Depois repetir no sentido inverso:

CENA N+1 → CENA N → CENA N-1

E repetir conforme o protocolo geral de certificação.

## Capturas mínimas

Registrar estado estável da cena anterior, início/meio/fim da entrada, dobra, estados principais da cena-alvo, início/meio/fim da saída, primeira imagem da próxima cena e os mesmos pontos no scroll reverso.

Captura iniciada diretamente na cena-alvo serve apenas para debugging local e não conta como auditoria visual oficial.

## Correção

A auditoria contextual pode descobrir vários problemas, mas continua valendo UM PROBLEMA POR CICLO.

Se a entrada estiver errada, corrigir/publicar/validar e repetir todo o percurso N-1 → N → N+1. Se a entrada estiver correta e a saída estiver errada, registrar a saída como próximo problema ativo, corrigir/publicar/validar e repetir novamente o percurso completo.

## Critério

Uma cena só pode ser certificada quando entrada, corpo da cena, saída e movimento reverso estiverem coerentes, sem salto, microtravada, duplicidade, seam, flash, clipping ou resíduo.
