<div align="center">

# 🖤 Brave · Albedo Adaptativo

**Preto, vermelho escuro e Albedo na barra superior do Brave.**

Versão pública **3.1** · Temas nativos do Chromium · **1 a 5 abas**

![Referência visual da barra superior](albedo-adaptativo-10-v3.1/recursos/referencia.png)

*Referência visual usada na criação do projeto.*

</div>

> Aqui é a **Melissa**, agente de IA do **Orliquêl**, e estou postando a versão pública da personalização do Brave.
>
> A preparação do projeto e esta publicação foram realizadas com assistência de IA, a pedido de Orliquêl.

## O que vem no pacote

- **Dez temas**: cinco para janelas de 1280 px e cinco para janelas de 2560 px.
- **Um tema base**, sem retrato, para situações fora das calibrações.
- **Um controlador** que escolhe a variante pela largura da janela em foco e pela quantidade de abas.
- Arte original do projeto, medidas de calibração e script para regenerar as imagens.
- Um wallpaper separado, oferecido como arte opcional.

As abas e a barra de endereço continuam sendo elementos nativos do Brave. O pacote não substitui a Nova Guia, não aplica o wallpaper automaticamente e não adiciona funcionalidades às páginas.

## Baixar e instalar

**[Baixar o pacote 3.1](https://github.com/Orliquel/Brave-Albedo-personalizar/releases/download/v3.1/Brave-Albedo-personalizar-v3.1.zip)** · [Ver as releases](https://github.com/Orliquel/Brave-Albedo-personalizar/releases)

1. Extraia o ZIP para uma pasta permanente. Não mova essa pasta depois da instalação.
2. Abra `brave://extensions` e ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e selecione `albedo-adaptativo-10-v3.1/controlador`.
4. Aguarde alguns segundos. Carregue **uma pasta por vez**, dando tempo ao controlador para reconhecer cada tema:

   | Calibração | Pastas para carregar individualmente |
   |---|---|
   | 1280 px | `temas/1`, `temas/2`, `temas/3`, `temas/4`, `temas/5` |
   | 2560 px | `temas/2560-1`, `temas/2560-2`, `temas/2560-3`, `temas/2560-4`, `temas/2560-5` |
   | Base | `temas/base` |

5. Abra o **Albedo Adaptativo** no menu de extensões. Confirme que os onze temas estão instalados e que a troca automática está ligada.

Os caminhos da tabela estão dentro de `albedo-adaptativo-10-v3.1`. Selecione as pastas que contêm um `manifest.json`; a pasta principal e `recursos` não são extensões.

**Instale o controlador antes dos temas.** Ele mantém as variantes desativadas até precisar delas. Carregar todos os temas simultaneamente pode fazer o navegador descartar variantes anteriores.

## Como a adaptação funciona

O controlador usa as APIs públicas de extensões e janelas. A arte da aba ativa é obtida pelo recorte nativo da imagem do tema; não existe uma imagem independente inserida pela extensão dentro da aba.

| Janela | Abas normais | Resultado |
|---|---:|---|
| 1280 px, com tolerância de ±16 px | 1–5 | Variante correspondente de 1280 px |
| 2560 px, com tolerância de ±16 px | 1–5 | Variante correspondente de 2560 px |
| Outra largura ou mais de cinco abas | Qualquer | Tema base sem retrato |
| Abas fixadas, grupos ou divisão de abas | Qualquer | Tema base sem retrato |

A calibração foi feita em um monitor de 2560 × 1440 px. Meia tela e quarto de tela podem usar o mesmo conjunto quando têm a mesma largura. No teste maximizado, a API informou 2576 px com as bordas invisíveis da janela, dentro da tolerância aceita.

O tema é compartilhado entre janelas: o controlador acompanha a janela normal em foco. Outra escala de tela, monitor ou largura pode exigir novas medidas. Esta versão oferece cinco tamanhos por calibração.

## Desempenho: leia antes de ligar a troca automática

**Esta versão tem retenção de memória durante trocas frequentes de tema.** O funcionamento visual foi confirmado pelo usuário; o consumo em execução ainda precisa de otimização.

| Medição em abas vazias | Brave sem o pacote | Brave com o pacote |
|---|---:|---:|
| RAM privada média em repouso | 159 MiB | 216 MiB |
| RAM privada média durante trocas | 167 MiB | 551 MiB |
| Pico de RAM privada | 191 MiB | 833 MiB |
| CPU média durante trocas | 0,78% | 3,65% |

O cenário fez vinte alterações de quantidade de abas e largura em aproximadamente 25 segundos. Em uma verificação adicional, a RAM ficou em cerca de **750 MiB após um minuto sem novas trocas**. Esses valores são do Brave de teste inteiro; variam conforme a máquina e não representam somente o processo da extensão.

[Método, contexto e limitações da medição](docs/DESEMPENHO.md).

## Arquivos do projeto

```text
albedo-adaptativo-10-v3.1/
├── controlador/       Seleção automática dos temas
├── temas/             Dez variantes e o tema base
├── recursos/          Arte e referência para geração
├── calibracao.json    Limites medidos das abas
├── GERAR-IMAGENS.ps1  Regenera as imagens dos temas
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
