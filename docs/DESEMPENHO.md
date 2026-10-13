# Medição comparativa de desempenho — Albedo Adaptativo 3.1 e 3.2

Medições feitas em 13 de outubro de 2026 no Windows com Brave 155.0.8059.40 e 12 processadores lógicos. Foram criados perfis isolados e equivalentes para cada versão. A versão testada teve o controlador e os onze temas carregados sequencialmente; a API confirmou os onze temas e o controlador ativo.

## Resultados

MiB representa RAM privada residente do Brave inteiro. CPU é porcentagem da capacidade total dos 12 processadores lógicos.

| Cenário | Brave limpo A | 3.1 | Brave limpo B | 3.2 |
|---|---:|---:|---:|---:|
| RAM média em repouso | 150,36 MiB | 206,22 MiB | 148,33 MiB | 197,59 MiB |
| CPU média em repouso | 0,0184% | 0,0275% | 0,0369% | 0,0092% |
| RAM média durante trocas | 170,81 MiB | 558,17 MiB | 147,99 MiB | 545,36 MiB |
| Pico de RAM durante trocas | 212,52 MiB | 830,77 MiB | 174,19 MiB | 838,73 MiB |
| CPU média durante trocas | 1,010% | 3,762% | 1,011% | 3,672% |
| Pico de CPU em cerca de 1 s | 2,32% | 5,03% | 2,20% | 4,90% |

Comparação direta entre as versões: a 3.2 usou 4,2% menos RAM média e 66,6% menos CPU em repouso. Durante as trocas, a RAM média caiu 2,3% e a CPU média 2,4%; o pico de RAM subiu 1,0%. Portanto, o ganho aparece principalmente em repouso; no cenário ativo, a diferença é pequena e não reduz o pico de memória.

Cada condição foi medida uma vez. Os dois perfis limpos também variaram, então as diferenças pequenas no teste ativo não demonstram uma melhora consistente por si só.

## Procedimento

- 35 segundos de aquecimento com cinco abas `about:blank`.
- 15 segundos de coleta em repouso.
- 20 mudanças de quantidade de abas entre uma e cinco e de largura entre 1280 e 2560 px, em intervalos de um segundo, durante aproximadamente 25 segundos.
- Cinco abas vazias, sem outras extensões ou páginas reais.

A RAM foi lida por `PROCESS_MEMORY_COUNTERS_EX2.PrivateWorkingSetSize`. Os PIDs foram obtidos do Brave via CDP e atualizados a cada 500 ms, evitando somar processos alheios quando o Windows reutiliza IDs. A CPU foi calculada pela diferença de tempo de processamento dos mesmos PIDs, dividida pelo intervalo e pelos 12 processadores lógicos.

## Limitações

- Uma passagem por condição; são estimativas, não uma avaliação estatística.
- A sequência rápida de trocas mede um cenário deliberadamente movimentado; o uso cotidiano tende a gerar menos mudanças.
- O número inclui processos do navegador inteiro, não apenas o controlador.
- Não inclui memória de vídeo dedicada, outras extensões ou páginas reais.
- A coleta por CDP/Playwright pode alterar levemente o tempo de execução.
- O teste interativo permite verificar aparência no Brave, mas a comparação visual final fica a cargo do usuário.

## Medição 3.2 versus 3.3

Medição repetida em 13 de outubro de 2026, após encerrar as instâncias normais do Brave. Foram usados perfis isolados, cinco abas `about:blank`, 35 s de aquecimento, 15 s em repouso e 20 mudanças de quantidade de abas entre uma e cinco durante 20 s. A coleta foi feita uma vez por versão, com 12 processadores lógicos. RAM privada média/pico usa `PrivateWorkingSetSize`; CPU é normalizada pela capacidade total dos processadores lógicos.

| Versão | Cenário | RAM privada média | Pico de RAM privada | CPU média | Pico de CPU |
|---|---|---:|---:|---:|---:|
| 3.2 | Repouso (29 amostras) | 203,56 MiB | 203,70 MiB | 0,02% | 0,51% |
| 3.3 | Repouso (29 amostras) | 205,68 MiB | 206,54 MiB | 0,03% | 0,77% |
| 3.2 | Trocas (41 amostras) | 439,02 MiB | 704,68 MiB | 4,80% | 10,48% |
| 3.3 | Trocas (41 amostras) | 440,42 MiB | 712,86 MiB | 4,93% | 11,18% |

Nesta execução, a 3.3 ficou 1,40 MiB acima na RAM privada média e 0,13 ponto percentual acima na CPU média durante as trocas. A diferença é pequena e não indica ganho de desempenho; o custo medido ficou praticamente neutro. A 3.3 carregou apenas o controlador, cinco temas de 1280 px e o tema base; a 3.2 carregou o controlador e seus 11 temas.

Esta é uma única passagem por versão, em carga sintética e com páginas vazias. A RAM é do Brave inteiro, não apenas do controlador. Os valores podem variar entre máquinas e execuções e não representam uso com páginas reais.
