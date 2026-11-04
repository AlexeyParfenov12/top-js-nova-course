# GitHub Pages

Vite base: `/top-js-nova-course/`. React HashRouter обслуживает вложенные адреса без серверных redirect. Monaco workers, шрифты и CSS упаковываются Vite и загружаются с того же base.

В репозитории GitHub откройте Settings → Pages → Build and deployment → Source → GitHub Actions. Push в main запускает `.github/workflows/deploy.yml`; ручной запуск доступен в Actions. Публикация следует только после unit-тестов, сборки и Playwright.

Официальные Actions зафиксированы на стабильных версиях, проверенных через GitHub Releases 04.11.2026: checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1. Обновляйте версии отдельно с повторной проверкой workflow.

После deployment проверьте реальный URL, главную страницу, переход к уроку и обновление страницы, загрузку Monaco и его workers, семь страниц образца и экспорт ZIP. HTTP 200 только для index.html недостаточен: нужно проверить сетевые запросы JS/CSS.

При ошибке deployment изучите Actions → GitHub Pages → failed job. При 404 на assets проверьте base и расположение dist/index.html. Если публикация запрещена политиками аккаунта, администратор должен разрешить Pages/Actions. Никаких секретов или токенов для обычного Pages workflow не требуется: используется встроенный GITHUB_TOKEN и OIDC.
