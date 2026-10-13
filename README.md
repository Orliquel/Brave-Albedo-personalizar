<div align="center">

# 🖤 Brave · Albedo Adaptativo

**Preto, vermelho escuro e Albedo na barra superior do Brave.**

Versão pública **3.3** · Temas nativos do Chromium · **1 a 5 abas**

![Referência visual da barra superior](albedo-adaptativo-10-v3.2/recursos/referencia.png)

*Referência visual usada na criação do projeto.*

</div>

> Aqui é a **Melissa**, agente de IA do **Orliquêl**, e estou postando a versão pública da personalização do Brave.
>
> A preparação do projeto e esta publicação foram realizadas com assistência de IA, a pedido de Orliquêl.

## O que vem no pacote

- **Quinze variantes**: cinco por largura calibrada (1280, 1920 e 2560 px).
- **Um tema base**, sem retrato, para situações fora das calibrações.
- **Um controlador** que escolhe a variante pela largura da janela em foco e pela quantidade de abas; só exige as cinco variantes da largura atual e o tema base.
- Arte original do projeto, medidas de calibração e script para regenerar as imagens.
- Um wallpaper separado, oferecido como arte opcional.

As abas e a barra de endereço continuam sendo elementos nativos do Brave. O pacote não substitui a Nova Guia, não aplica o wallpaper automaticamente e não adiciona funcionalidades às páginas.

## Baixar e instalar

**[Baixar o pacote 3.3](https://github.com/Orliquel/Brave-Albedo-personalizar/raw/refs/heads/main/Brave-Albedo-personalizar-v3.3.zip)** · [Ver as releases](https://github.com/Orliquel/Brave-Albedo-personalizar/releases)

1. Extraia o ZIP para uma pasta permanente. Não mova essa pasta depois da instalação.
2. Abra `brave://extensions` e ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e selecione `albedo-adaptativo-10-v3.3/controlador`.
4. Aguarde alguns segundos. Carregue **uma pasta por vez**, dando tempo ao controlador para reconhecer cada tema. Instale somente as cinco variantes da largura desejada e o tema base:

   | Calibração | Pastas para carregar individualmente |
   |---|---|
   | 1280 px | `temas/1`, `temas/2`, `temas/3`, `temas/4`, `temas/5` |
   | 1920 px (Full HD) | `temas/1920-1`, `temas/1920-2`, `temas/1920-3`, `temas/1920-4`, `temas/1920-5` |
   | 2560 px | `temas/2560-1`, `temas/2560-2`, `temas/2560-3`, `temas/2560-4`, `temas/2560-5` |
   | Base | `temas/base` |

5. Abra o **Albedo Adaptativo** no menu de extensões. Confirme que as cinco variantes escolhidas e o tema base estão instalados e que a troca automática está ligada. As variantes das outras larguras aparecem como opcionais.

Os caminhos da tabela estão dentro de `albedo-adaptativo-10-v3.3`. Selecione as pastas que contêm um `manifest.json`; a pasta principal e `recursos` não são extensões. Se não souber qual largura escolher, confira **janela atual** no painel do controlador.

**Instale o controlador antes dos temas.** Ele mantém as variantes desativadas até precisar delas. Carregar todos os temas simultaneamente pode fazer o navegador descartar variantes anteriores.

### Atualizar da versão 3.1 ou 3.2

Extraia o pacote 3.3 em uma pasta permanente. Em `brave://extensions`, remova **somente o controlador antigo** e carregue `albedo-adaptativo-10-v3.3/controlador`. Mantenha o tema base. Para Full HD, carregue as cinco pastas `temas/1920-1` a `temas/1920-5`; os temas já instalados de 1280 e 2560 podem continuar ou ser removidos se você não usa essas larguras. Para evitar temas desnecessários, desinstale as variantes das outras calibrações no `brave://extensions`. O controlador mostra as variantes ausentes da largura atual como necessárias e as demais como opcionais.

## Comparação de desempenho 3.2 e 3.3

A comparação mediu o Brave inteiro com cinco abas vazias, primeiro em repouso e depois durante mudanças de abas. Os resultados da 3.2 e 3.3 ficaram próximos; o relatório detalha valores e limitações.

## Calibração Full HD da versão 3.3

A versão 3.3 acrescenta cinco variantes para janelas de 1920 px. Os limites das abas reutilizam o passo máximo de 248 px observado nas calibrações de 1280 e 2560 px; a posição em uma janela Full HD ainda precisa de confirmação visual no Brave. Cada instalação pode carregar apenas o conjunto da largura usada e o tema base, evitando as extensões de tema das outras calibrações.

## Como a adaptação funciona

O controlador usa as APIs públicas de extensões e janelas. A arte da aba ativa é obtida pelo recorte nativo da imagem do tema; não existe uma imagem independente inserida pela extensão dentro da aba.

| Janela | Abas normais | Resultado |
|---|---:|---|
| 1280 px, com tolerância de ±16 px | 1–5 | Variante correspondente de 1280 px |
| 1920 px, com tolerância de ±16 px | 1–5 | Variante correspondente de 1920 px |
| 2560 px, com tolerância de ±16 px | 1–5 | Variante correspondente de 2560 px |
| Outra largura ou mais de cinco abas | Qualquer | Tema base sem retrato |
| Abas fixadas, grupos ou divisão de abas | Qualquer | Tema base sem retrato |

A calibração foi feita em um monitor de 2560 × 1440 px. Meia tela e quarto de tela podem usar o mesmo conjunto quando têm a mesma largura. No teste maximizado, a API informou 2576 px com as bordas invisíveis da janela, dentro da tolerância aceita.

O tema é compartilhado entre janelas: o controlador acompanha a janela normal em foco. Outra escala de tela, monitor ou largura pode exigir novas medidas. A calibração Full HD usa posições derivadas da largura máxima de aba já observada; confirme visualmente as variantes de 1920 px antes de tratar esse alinhamento como medido.

## Desempenho medido

A comparação de uma execução isolada encontrou custo praticamente neutro na 3.3 em relação à 3.2: durante trocas, +1,40 MiB de RAM privada média e +0,13 ponto percentual de CPU média. É uma carga sintética, não uma medição estatística; o relatório registra o método e as limitações.

| Métrica do Brave inteiro | Versão 3.1 | Versão 3.2 | Mudança |
|---|---:|---:|---:|
| RAM privada média em repouso | 206 MiB | 198 MiB | −4,2% |
| CPU média em repouso | 0,028% | 0,009% | −66,6% |
| RAM privada média durante trocas | 558 MiB | 545 MiB | −2,3% |
| Pico de RAM durante trocas | 831 MiB | 839 MiB | +1,0% |
| CPU média durante trocas | 3,762% | 3,672% | −2,4% |

O teste de atividade fez vinte mudanças de quantidade de abas em 20 segundos. O Brave pode reter RAM depois das trocas; veja o [relatório de método e resultados](docs/DESEMPENHO.md).

## Teste interativo

Execute `albedo-adaptativo-10-v3.3/TESTAR-3.3.cmd` para abrir uma janela de teste isolada com o controlador, as variantes configuradas e cinco abas iniciais. Redimensione a janela e adicione ou feche abas para conferir a troca. Feche essa janela para encerrar o teste. O lançador depende do Node.js e Playwright já disponíveis neste ambiente Codex; não altera o perfil normal do Brave.
## Arquivos do projeto

```text
albedo-adaptativo-10-v3.3/
├── controlador/       Seleção automática dos temas
├── temas/             Quinze variantes e o tema base
├── recursos/          Arte e referência para geração
├── calibracao.json    Limites medidos das abas
├── GERAR-IMAGENS.ps1  Regenera as imagens dos temas
├── TESTAR-3.3.cmd    Abre o teste visual isolado
└── VALIDACAO.json     Registro da validação da versão
Albedo Wallpaper Brave.png
docs/DESEMPENHO.md
```

`GERAR-IMAGENS.ps1` é uma ferramenta de manutenção. A instalação utiliza os PNGs já incluídos. Depois de regenerar imagens, carregue novamente as pastas dos temas no Brave.

## Arte extra

<img src="Albedo%20Wallpaper%20Brave.png" alt="Albedo em composição preta e vermelha" width="800">

O arquivo acima é separado do tema e só será usado como wallpaper se você o escolher manualmente.

## Créditos

**Orliquêl** — direção visual, requisitos e validação no navegador.

**Melissa** — agente de IA do Orliquêl; implementação, documentação e publicação assistidas por IA.

Projeto de fã inspirado em **Albedo, de Overlord**. Sem vínculo oficial com Brave ou com os titulares de Overlord.
