# iTBI-calc - Gestão de Imóveis e Cálculo de ITBI

Um aplicativo móvel desenvolvido com React Native e Expo para gestão de imóveis e cálculo de ITBI (Imposto sobre Transmissão de Bens Imóveis).

## 📱 Funcionalidades

- **Cadastro de Imóveis**: Registre imóveis com informações detalhadas
  - Endereço completo
  - Área do imóvel
  - Valor do imóvel
  - Tipo do imóvel
  - Localização

- **Cálculo de ITBI**: Calcule o imposto de transferência
  - Cálculo automático baseado no valor do imóvel
  - Taxa configurável (atualmente 2%)
  - Resultado instantâneo

- **Gestão de Imóveis**
  - Listagem de todos os imóveis cadastrados
  - Edição de informações
  - Exclusão de registros
  - Visualização detalhada

## 🚀 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Elements](https://reactnativeelements.com/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- [Android Studio](https://developer.android.com/studio) (para emulador Android)
- Ou dispositivo físico com [Expo Go](https://expo.dev/client)

## 🔧 Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/lucasskt18/Dispositivos-Moveis.git
cd iTBI-calc
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install ou yarn install
\`\`\`

3. Inicie o projeto:
\`\`\`bash
npx expo start
\`\`\`

## 📱 Executando no Emulador

1. Instale e configure o Android Studio
2. Crie um dispositivo virtual (AVD) no AVD Manager
3. Inicie o emulador
4. Execute o projeto com:
\`\`\`bash
npx expo start --android
\`\`\`

## 📱 Executando no Dispositivo Físico

1. Instale o aplicativo Expo Go no seu dispositivo
2. Execute o projeto com \`npx expo start\`
3. Escaneie o QR Code com o Expo Go (Android) ou Câmera (iOS)

## Colaboradores

- Lucas Amancio, Daniel Formoso, Guilherme Valentim e Arthur Moreira
