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
