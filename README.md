# Auxílio PY — aplicativo móvel

Projeto real do MVP do **Auxílio PY**, criado em React Native + Expo SDK 57 para Android e iPhone.

## Estado atual

A primeira versão possui:

- seleção de perfil Cliente / Prestador / Admin
- localização GPS real do cliente
- solicitação de assistência
- lista inicial de prestadores
- fluxo de solicitação, aceite e acompanhamento
- prestador online/offline
- cálculo e envio de proposta
- painel administrativo inicial

Os dados de prestadores ainda são demonstrativos e ficam no próprio aplicativo. Banco de dados, login persistente, notificações e comunicação entre celulares entram na próxima fase.

## Testar no Expo Go

```bash
npm install
npx expo install --fix
npx expo start
```

Abra **Expo Go** no celular e leia o QR Code.

## Gerar APK Android

O projeto já contém `eas.json` com o perfil `preview` configurado para produzir `.apk`.

```bash
npm install
npx expo install --fix
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build -p android --profile preview
```

Consulte também `BUILD_APK.md`.

## Google Play

O perfil `production` gera `.aab`:

```bash
npx eas-cli@latest build -p android --profile production
```
