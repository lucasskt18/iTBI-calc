# iTBI-calc

Aplicativo móvel (React Native + Expo) para cadastro de imóveis e **estimativa** de ITBI (Imposto sobre Transmissão de Bens Imóveis).

O ITBI é definido pelo **município**. O app não consulta alíquota oficial: o usuário informa a porcentagem. O padrão **2%** é só um ponto de partida editável.

## Funcionalidades

- **Cadastro de imóveis**: endereço (ViaCEP), área, tipo, proprietário e telefone
- **Cálculo de ITBI**: base = maior valor entre venal e transação; ITBI = base × (alíquota / 100)
- **Gestão local**: listar, editar, excluir e gravar o cálculo no próprio registro (AsyncStorage)

## Tecnologias

- [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) / [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Elements](https://reactnativeelements.com/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [ViaCEP](https://viacep.com.br/)

## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Android Studio (emulador) ou [Expo Go](https://expo.dev/client) no celular

## Instalação

```bash
git clone https://github.com/lucasskt18/iTBI-calc.git
cd iTBI-calc
npm install
npx expo start
```

Testes da fórmula e do parse de moeda:

```bash
npm test
```

## Executando

Emulador Android:

```bash
npx expo start --android
```

Dispositivo físico: abra o Expo Go (Android) ou a Câmera (iOS) e leia o QR Code.

## Documentação

- [Carta de Apresentação](https://drive.google.com/file/d/1TacRJokpeL5ZtLSPH4vPiuPFz2nQUKmK/view?usp=sharing)
- [Roteiro de Extensão](https://drive.google.com/file/d/1YyZEVGYEve-Y3kIm3ZnxyWJmDAkcQzap/view?usp=sharing)

## Colaboradores

- Lucas Amancio
- Daniel Formoso
- Guilherme Valentim
- Arthur Moreira
