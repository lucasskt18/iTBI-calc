# Resumo do projeto iTBI-calc

App mobile de **gestão de imóveis** e **cálculo de ITBI** (Imposto sobre Transmissão de Bens Imóveis). Origem acadêmica (**Dispositivos Móveis**): o `package.json` ainda se chama `dispositivos-moveis`; o slug no Expo é `Dispositivos-Moveis`. Colaboradores: Lucas Amancio, Daniel Formoso, Guilherme Valentim, Arthur Moreira.

O usuário cadastra um imóvel (endereço, área, tipo, proprietário, telefone), lista/edita/exclui registros e, na listagem, calcula o ITBI informando valor de transação, valor venal e alíquota. Não há servidor, login nem API municipal.

## Stack

- **Expo** ^53, **React** 19, **React Native** 0.79, **TypeScript** ~5.8
- **React Navigation** (native stack), **React Native Elements** (`@rneui`)
- **AsyncStorage** (persistência local)
- **axios** + **ViaCEP** (único serviço externo)
- **expo-av** / vídeo na tela Sobre Nós
- Sem backend, Docker, ORM, testes ou CI no repositório

Entrada: `index.ts` → `App.tsx` → `src/navigation/AppNavigator.tsx`.

## Arquitetura

Cliente único, camadas finas:

- **Apresentação:** telas em `src/screens/` e componentes em `src/components/` (modais, selects, calculadora).
- **Navegação:** stack sem header, tema escuro `#1A1A2E`.
- **Domínio:** `src/utils/calculateITBI.tsx` — em grande parte **não ligado** à UI.
- **Persistência:** JSON em AsyncStorage, chave `"properties"`. Pasta `src/database/` vazia.
- **Estado:** só `useState` / `useEffect` / `useFocusEffect` (sem Redux/Zustand).

Telas: Home (menu) → Cadastro → Consultar e Calcular ITBI → Editar (`propertyId`) → Sobre Nós (vídeo).

Fluxo:

1. `index.ts` registra `App.tsx`.
2. `AppNavigator` abre Home, RegisterProperty, ListProperties, EditProperty, AboutUs.
3. Cadastro consulta ViaCEP e grava no AsyncStorage (`properties`).
4. Listagem e edição leem/escrevem o mesmo armazenamento.
5. `CalculatorITBI` (na listagem) persiste venal, base e ITBI no registro.

## Modelo de dados

Não há schema de banco. O “modelo” é um objeto TypeScript repetido (e **inconsistente**) nas telas.

Campos típicos no cadastro: `id` (timestamp), `cep`, `address`, `neighborhood`, `city`, `state`, `area`, `type`, `property` (nome do dono), `phone`.

Depois do cálculo na lista: `venalValue`, `propertyValue` (base = maior entre venal e transação), `itbiValue`.

A tela de edição usa interface diferente (`telefone` em vez de `phone`; sem campos de ITBI). Tipos de imóvel (`TIPOS_IMOVEIS`) e UFs com alíquotas ilustrativas (`ESTADOS_BRASILEIROS`) vivem em `src/screens/RegisterPropertyScreen.tsx`.

## Como o ITBI é calculado

O que a UI realmente faz (`src/components/CalculatorITBI.tsx`):

- Base = `max(valorVenal, valorTransacao)`
- ITBI = base × (alíquota % / 100)
- Alíquota **digitada pelo usuário**; as alíquotas por UF **não** são aplicadas automaticamente.

Utils (`src/utils/calculateITBI.tsx`): mesma ideia de “maior valor”; plus `calcularValorVenal` = `(área construção × m² + área terreno × m²) × fator` — **não usado nas telas**.

O README fala em taxa ~2%; o código atual é alíquota livre. ITBI na vida real é **municipal**; aqui é simplificação acadêmica.

## Integrações e o que não existe

- **ViaCEP:** CEP com 8 dígitos no cadastro preenche logradouro, bairro, cidade e UF.
- Sem auth, sem APIs de prefeitura, sem testes, sem valor venal automático.

## Inconsistências úteis de saber

- Interfaces Property divergentes (Register vs List vs Edit).
- Alíquotas por estado só decorativas.
- Fórmulas duplicadas (componente vs util).
- `validatePhone` aparentemente sem uso.
- Assets de ícone/splash citados em `app.json` podem estar faltando; existem `logo.png` e o vídeo de apresentação.

## Fluxo do usuário

1. Cadastrar imóvel (CEP → ViaCEP → salvar no array local).
2. Listar, editar ou excluir.
3. Abrir a calculadora na lista, informar transação/venal/alíquota, gravar ITBI no mesmo registro.
4. Sobre Nós com missão/equipe e vídeo.
