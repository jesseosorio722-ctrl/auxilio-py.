# Gerar o APK pelo GitHub Actions

O projeto já inclui `.github/workflows/build-apk.yml`.

Quando o código estiver em um repositório GitHub:

1. Abra a aba **Actions**.
2. Selecione **Build Auxilio PY APK**.
3. Clique em **Run workflow**.
4. Ao terminar, abra o job concluído.
5. Em **Artifacts**, baixe **Auxilio-PY-APK**.
6. Dentro do ZIP do artifact estará `Auxilio-PY.apk`.

Esse APK é uma build de teste instalável diretamente em Android. Para publicação na Play Store será criada posteriormente uma build release assinada/AAB.
