# Docker ishga tushirish

Repositorylar yonma-yon bo‘lsin: `MNShop/` va `mnshop-react/`. Buyruqlarni `mnshop-react` ichidan bajaring.

1. Backend `MNShop/.env` ichida mavjud `MONGO_URL`, `SESSION_SECRET`, Google va payment sozlamalari bo‘lsin. Faylni Gitga qo‘shmang. MongoDB tashqi server/Atlasda bo‘lsa container unga kira olishi kerak; container ichidagi `localhost` laptop/server MongoDB’si emas.
2. Frontend `.env` ichidagi ommaviy `REACT_APP_GOOGLE_CLIENT_ID` Compose tomonidan buildga beriladi. Secret Google key yoki Toss secretni frontendga bermang.
3. `MNShop/uploads` mavjud rasmlar bilan serverga ko‘chirilsin va UID 1000 yozishi mumkin bo‘lsin. Bu papkani va database’ni alohida backup qiling. Huquqlarni o‘zgartirishdan oldin serverdagi egasini tekshiring; `chmod 777` ishlatmang.
4. `docker compose config --quiet` bilan tekshiring. Oddiy `docker compose config` secret qiymatlarni terminalga chiqarishi mumkin.
5. `docker compose build` va keyin `docker compose up -d`.
6. `docker compose ps` va `docker compose logs --tail=100 mnshop` bilan holatni tekshiring. Loglarni ulashishdan oldin maxfiy ma’lumot yo‘qligini tekshiring.

Backend `127.0.0.1:1213`da buyer `/`, seller `/seller/`, admin `/admin`ni xizmat qiladi. Hostdagi Nginx/Caddy HTTPS trafikni shu portga yo‘naltirsin. Boshqa containerdagi proxy uchun Docker network orqali `mnshop:1213` ishlatiladi. DNS, TLS, www redirect va production OAuth callbacklar bu fayllarda avtomatik sozlanmaydi.

Build database’ga bog‘lanmaydi va statik sitemapni oladi. Mahsulot URL’li sitemap uchun backend ishlagach alohida release/sitemap jarayonini bajarish va natijani xizmat qilayotgan buildga yetkazish kerak (SEO.md). Container ichidagi sitemap hozir statik 14 URL’dan iborat.

Dockerfile-specific `Dockerfile.dockerignore` ota papkadagi boshqa fayllar va ikkala repositorydagi `.env`/uploads/Git tarixini build contextdan chiqaradi. Named volume o‘rniga mavjud uploads papkasi ulanadi — rasmlar jimgina bo‘sh volume bilan almashtirilmaydi.
