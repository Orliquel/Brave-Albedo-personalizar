# Medição de RAM e CPU

Os números abaixo pertencem à versão **3.1**. A versão 3.2 agrupa eventos por 650 ms, remove verificações em simples mudanças de aba selecionada e evita regravar status idêntico. O efeito desses ajustes ainda não foi medido; não use os números da 3.1 como se fossem um benchmark da 3.2.

Medição realizada em **13 de outubro de 2026**, no Windows, usando Brave baseado em Chromium **155.0.8059.40** e uma máquina com **12 processadores lógicos**.

Foram usados perfis isolados, com os mesmos argumentos de inicialização, de uma a cinco abas `about:blank`, larguras de 1280 e 2560 px e instrumentação por Playwright/CDP. O perfil com o pacote teve o controlador e os onze temas carregados sequencialmente. A API confirmou cinco abas, a variante de 2560 px ativa e todas as variantes instaladas.

## Resultados

| Cenário | Sem pacote | Com pacote | Diferença aproximada |
|---|---:|---:|---:|
| RAM privada média em repouso | 158,90 MiB | 216,04 MiB | +57,14 MiB |
| RAM privada média durante trocas | 166,83 MiB | 551,22 MiB | +384,39 MiB |
| Pico de RAM privada durante trocas | 190,72 MiB | 832,81 MiB | +642,09 MiB entre os picos |
| CPU média em repouso | 0,0178% | 0,0268% | +0,009 ponto percentual |
| CPU média durante trocas | 0,7802% | 3,6502% | +2,8700 pontos percentuais |
| Pico de CPU em intervalo de cerca de um segundo | 1,77% | 5,02% | — |

## Procedimento

1. Aquecimento de 35 segundos com cinco abas vazias.
2. Coleta de aproximadamente 15 segundos em repouso.
3. Vinte alterações de quantidade de abas, seleção de aba e largura de janela durante uma coleta de aproximadamente 25 segundos.
4. Verificação adicional do pacote após outra sequência de vinte alterações, seguida de 60 segundos sem interações.

A RAM foi medida somando `PROCESS_MEMORY_COUNTERS_EX2.PrivateWorkingSetSize` dos processos do perfil isolado. O contador representa RAM privada residente; não duplica páginas compartilhadas entre processos. A CPU foi calculada pela diferença de tempo de processamento desses processos, dividida pelo intervalo e pelos doze processadores lógicos.

## Depois que as trocas param

A verificação adicional chegou a **808,93 MiB** de pico. Nos últimos quinze segundos da pausa de um minuto, permaneceu em **750,31 MiB** de RAM privada média e **0,0249%** de CPU média.

Na última amostra, aproximadamente **612 MiB** estavam no processo principal do Brave, enquanto o processo de renderização da extensão estava em aproximadamente **15 MiB**. Houve retenção de memória no navegador durante a aplicação repetida de temas; esta medição não estabelece se o comportamento é um vazamento permanente ou uma política de cache.

## Limitações

- Uma passagem comparativa por configuração e uma verificação adicional de recuperação; pequenas diferenças entre processos afetam a estimativa.
- As amostras têm intervalos de aproximadamente um segundo e não capturam todos os picos menores que isso.
- Abas vazias: páginas reais e outras extensões não foram incluídas.
- Memória compartilhada e memória de vídeo dedicada não fazem parte do número de RAM privada.
- A instrumentação pode alterar o estado de execução do service worker.
- O resultado visual foi aprovado pelo usuário; não foi feita uma comparação de capturas para afirmar identidade com a referência.

A troca automática continua experimental quanto ao custo de memória. A versão 3.2 reduz trabalho redundante do controlador, mas não há uma nova medição que demonstre redução da retenção observada no processo principal do Brave.
