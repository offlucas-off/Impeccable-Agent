# Cérebro Galáctico

Seu cofre do Obsidian como uma galáxia espiral em 3D, que você atravessa voando. Cada nota é uma estrela, cada link deposita poeira estelar no caminho, e o cofre reage enquanto você trabalha: abrir uma nota faz a estrela pulsar, salvar dispara raios para as notas ligadas, e uma nota de captura chama uma tempestade a partir do núcleo.

*Your Obsidian vault as a 3D spiral galaxy you can fly through. Notes are stars, links leave stardust, and the galaxy reacts live as you open, save and create notes. Interface in Portuguese (pt-BR).*

## O que faz

- **Galáxia viva:** as pastas de topo viram braços da espiral, o arquivo morto vira o halo, e notas soltas ficam no núcleo.
- **Reage ao cofre:** abrir, salvar, criar, ligar, renomear e apagar notas aparecem na hora.
- **Navegação:** arraste para girar, role para voar na direção do ponteiro, clique numa estrela para abrir a nota. Ctrl/Cmd+K busca.
- **Leve:** para de desenhar quando a aba está escondida. "Efeitos reduzidos" ajuda em GPU integrada, e o movimento reduzido do sistema é respeitado.
- **Offline e só leitura:** nada sai do seu computador e o plugin nunca altera suas notas.
- **Som opcional:** trovão sintetizado, desligado por padrão.

## Configurar

Em **Configurações → Cérebro Galáctico**:

- **Regiões:** cada pasta de topo ocupa uma região. O automático dá os braços longos às maiores pastas e manda pastas de arquivo para o halo. Mude qualquer pasta pelo menu ao lado dela.
- **Nota do núcleo:** a estrela central. Sem ela, vale a nota com mais links.
- **Nota de captura:** salvar esta nota dispara a tempestade. Vazio desliga.
- Som, efeitos reduzidos, atividade de fundo, halo e abrir em aba nova.

## Instalar à mão

Copie `main.js`, `manifest.json` e `styles.css` para `<cofre>/.obsidian/plugins/cerebro-galactico/` e ative o plugin em Configurações → Plugins da comunidade.

## Requisitos

Obsidian 1.5.7 ou mais novo, no computador (Windows, macOS ou Linux), com WebGL. Pensado para 30 quadros por segundo ou mais com cerca de 1.300 notas numa GPU integrada; o painel de filtros mostra os quadros por segundo medidos no seu computador.

## Licença

MIT
