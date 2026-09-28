# Gerar o APK do Auxílio PY

O projeto está configurado para Expo SDK 57 e para gerar um APK instalável no Android via EAS Build.

## 1. Instalar dependências

```bash
npm install
npx expo install --fix
```

## 2. Entrar na conta Expo

```bash
npx eas-cli@latest login
```

## 3. Configurar o projeto EAS na primeira vez

```bash
npx eas-cli@latest build:configure
```

Se o EAS adicionar um `projectId` em `app.json`, mantenha esse valor.

## 4. Gerar APK instalável

```bash
npx eas-cli@latest build -p android --profile preview
```

Ao terminar, o EAS fornece um link/QR Code para baixar o `.apk` diretamente no Android.

## Publicar depois na Google Play

Para a Play Store, use AAB:

```bash
npx eas-cli@latest build -p android --profile production
```
