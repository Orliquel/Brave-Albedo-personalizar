# Histórico

## 3.3 — suporte a Full HD e instalação enxuta

- Medição isolada de RAM e CPU contra a versão 3.2; custo praticamente neutro na carga testada.

- Cinco variantes para janelas de 1920 px.
- O controlador exige as cinco variantes da largura atual e o tema base; os conjuntos das outras calibrações são opcionais.
- O painel diferencia variantes instaladas, necessárias e opcionais.
- A geometria de 1920 px reaproveita o passo máximo de aba observado nas calibrações anteriores e precisa de confirmação visual no Brave.
- Medição isolada de RAM e CPU contra a versão 3.2; custo praticamente neutro na carga testada.

## 3.2 — atualização do controlador

- Debounce de 650 ms para agrupar eventos de abas e janelas.
- A seleção de outra aba não dispara uma reconciliação quando a quantidade não mudou.
- Estados repetidos não são regravados na área de armazenamento nem no badge.
- Atualização do README com migração da 3.1: basta substituir o controlador; os onze temas permanecem instalados.
- Inclusão da comparação de desempenho 3.1 versus 3.2 e de lançador para teste local isolado.

A comparação isolada mostra redução de CPU em repouso; durante trocas rápidas, o ganho é pequeno e o pico de RAM permaneceu praticamente igual. Veja [docs/DESEMPENHO.md](docs/DESEMPENHO.md).

## 3.1 — publicação inicial

- Dez variantes nativas para as calibrações de 1280 e 2560 px, com uma a cinco abas.
- Controlador automático e tema base para situações fora do escopo.
- Faixas de cabelo ampliadas à largura das abas, preservando o tamanho e a posição do rosto.
- Bordas suaves e composição escura para manter a legibilidade.
- Instruções de instalação e documentação de RAM e CPU.
- Wallpaper incluído como recurso opcional separado.
- Publicação preparada por Melissa, agente de IA do Orliquêl.
