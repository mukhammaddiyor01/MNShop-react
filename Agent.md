# MNShop React — yagona Agent spetsifikatsiyasi

## 1. Hujjat vazifasi

Bu fayl `/Users/mukhammaddiyor/Desktop/mnshop-react` ichidagi MNShop buyer va seller frontendlarini rivojlantirish uchun yagona majburiy qo‘llanmadir.

Loyiha ikki manbadan foydalanadi va ularning vazifasi aralashtirilmaydi:

1. Hozirgi MNShop loyiha va `agent.md` — vizual va product behavior source of truth.
2. Burak React loyiha konteksti — kod arxitekturasi, folder/file tashkiloti, Redux + Context oqimi va coding style source of truth.

Qat’iy qoida:

- MNShop frontend qayta dizayn qilinmaydi.
- Burak’ning restoran dizayni, ranglari, matnlari yoki domain nomlari ko‘chirilmaydi.
- MNShop’ning ranglari, shriftlari, spacing, radius, logo, responsive holatlari va barcha UI state’lari 100% saqlanadi.
- Burak’dan faqat kodni qanday ajratish, data qanday oqishi va featurelar qanday tashkil qilinishi olinadi.
- Next.js kodlari target CRA runtime’ga to‘g‘ridan-to‘g‘ri ko‘chirilmaydi; ko‘rinish va behavior React Router v5/MUI/CSS yordamida aynan qayta hosil qilinadi.

## 2. Target va ilovalar

Asosiy target:

```text
/Users/mukhammaddiyor/Desktop/mnshop-react
```

Ikki mustaqil frontend mavjud:

```text
mnshop-react/             Buyer CRA app, port 1214
└── src-seller/           Seller CRA app, port 1215
```

Buyer va seller:

- bir backend API contractidan foydalanadi;
- bir xil design tokenlarini saqlaydi;
- source va runtime jihatdan alohida app bo‘lib qoladi;
- buyer order lifecycle va seller fulfillment uchun bir xil status contractidan foydalanadi.

## 3. Texnologik kontrakt

Target uchun majburiy stack:

- React 18 + TypeScript.
- Create React App, `react-scripts`.
- Routing: `react-router-dom` v5 (`BrowserRouter`, `Switch`, `Route`, `NavLink`, `useHistory`).
- Serverdan kelgan feature data: Redux Toolkit slice + selector.
- Global client state: React Context + custom hooks.
- HTTP: Axios, `REACT_APP_API_URL`, `withCredentials: true`.
- UI: mavjud MUI v5/v4, Emotion va styled-components konfiguratsiyasi.
- Notification: SweetAlert2.
- Slider: Swiper.
- Realtime: Socket.IO client.
- Persistent data: localStorage va backend session cookie.

Taqiqlanadi:

- Next.js, App Router, `next/link`, `next/image`, server component yoki Next route handler kiritish;
- React Router v6 API ishlatish;
- yangi UI framework yoki boshqa icon pack kiritish;
- business datani UI component ichida hardcode qilib API’ni chetlab o‘tish;
- mavjud status, enum, endpoint yoki persisted keylarni o‘zboshimchalik bilan rename qilish.

## 4. Provider tartibi

Buyer va seller entry pointlarida providerlar quyidagi tartibda ulanadi:

```text
Redux Provider
└── ContextProvider
    └── MUI ThemeProvider
        └── CssBaseline
            └── BrowserRouter
                └── App
```

`ContextProvider` Redux o‘rniga ishlatilmaydi. Mas’uliyatlar:

- Redux: backenddan kelgan va bir feature ichida subscribe qilinadigan server data.
- Context: auth member, basket, cart drawer, likes snapshot, theme/language va `orderBuilder` kabi cross-page client state.
- Component local state: modal, form draft, active tab, filter input, loading interaction kabi vaqtinchalik UI state.

## 5. Arxitektura tamoyili

Burak’dagi feature + shared layer aralashmasi saqlanadi:

```text
View/UI
  -> Service request
  -> dispatch(slice action)
  -> reducer
  -> Redux store
  -> selector
  -> View/UI re-render
```

Har server-data feature oqimi:

```text
1. screen/index.tsx yoki feature component request boshlaydi
2. services/*Service.ts Axios orqali backendga murojaat qiladi
3. service normalizatsiya qilingan data qaytaradi
4. view setX(data) actionini dispatch qiladi
5. slice reducer feature state’ni yangilaydi
6. selector store’dan kerakli bo‘lakni qaytaradi
7. subscriber component qayta render bo‘ladi
```

Async thunk majburiy emas. Burak uslubida request `useEffect`/handler ichida service orqali bajarilib, natija oddiy slice action bilan store’ga yozilishi mumkin.

## 6. Buyer folder strukturasi

```text
src/
├── app/
│   ├── components/
│   │   ├── auth/index.tsx
│   │   ├── divider/index.tsx
│   │   ├── footer/index.tsx
│   │   ├── headers/
│   │   │   ├── HomeNavbar.tsx
│   │   │   ├── OtherNavbar.tsx
│   │   │   ├── Basket.tsx
│   │   │   └── MobileBottomNav.tsx
│   │   ├── product/ProductCard.tsx
│   │   ├── product/ProductDetail.tsx
│   │   └── shared/
│   │       ├── BackToTop.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingState.tsx
│   ├── context/ContextProvider.tsx
│   ├── hooks/
│   │   ├── useBasket.ts
│   │   ├── useGlobals.ts
│   │   └── usePreferences.ts
│   ├── MaterialTheme/
│   │   ├── index.ts
│   │   ├── shadow.ts
│   │   ├── styled.ts
│   │   └── typography.ts
│   ├── screens/
│   │   ├── homePage/
│   │   │   ├── index.tsx
│   │   │   ├── slice.ts
│   │   │   ├── selector.ts
│   │   │   └── section componentlari
│   │   ├── productsPage/
│   │   │   ├── index.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ChosenProduct.tsx
│   │   │   ├── slice.ts
│   │   │   └── selector.ts
│   │   ├── ordersPage/
│   │   │   ├── index.tsx
│   │   │   ├── PendingOrders.tsx
│   │   │   ├── ActiveOrders.tsx
│   │   │   ├── FinishedOrders.tsx
│   │   │   ├── slice.ts
│   │   │   └── selector.ts
│   │   ├── cartPage/index.tsx
│   │   ├── checkoutPage/index.tsx
│   │   ├── likesPage/index.tsx
│   │   ├── chatPage/index.tsx
│   │   ├── userPage/index.tsx
│   │   ├── helpPage/index.tsx
│   │   ├── aboutPage/index.tsx
│   │   └── authPage/
│   │       ├── Login.tsx
│   │       └── Signup.tsx
│   ├── services/
│   │   ├── ApiService.ts
│   │   ├── MemberService.ts
│   │   ├── ProductService.ts
│   │   ├── OrderService.ts
│   │   └── MessageService.ts
│   ├── App.tsx
│   ├── hooks.ts
│   └── store.ts
├── css/
│   ├── index.css
│   ├── app.css
│   ├── navbar.css
│   ├── footer.css
│   ├── home.css
│   ├── products.css
│   ├── order.css
│   ├── checkout.css
│   ├── userPage.css
│   └── help.css
├── lib/
│   ├── data/
│   ├── enums/
│   ├── types/
│   ├── config.ts
│   ├── productMapper.ts
│   └── sweetAlert.ts
└── index.tsx
```

Shared komponent route’ga bog‘lanmaydi. Featurega xos UI o‘sha `screens/<feature>/` ichida qoladi. Katta `sharedPages.tsx`, barcha featurelarni bitta filega yig‘ish yoki featurelararo circular import taqiqlanadi.

## 7. Seller folder strukturasi

Seller buyer bilan bir xil coding pattern ishlatadi:

```text
src-seller/src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── modal/
│   │   └── shared/
│   ├── context/ContextProvider.tsx
│   ├── hooks/
│   ├── MaterialTheme/
│   ├── screens/
│   │   ├── overviewPage/
│   │   ├── productsPage/
│   │   ├── ordersPage/
│   │   ├── messagesPage/
│   │   ├── analyticsPage/
│   │   ├── settingsPage/
│   │   └── authPage/
│   ├── services/
│   │   ├── ApiService.ts
│   │   ├── SellerService.ts
│   │   └── MessageService.ts
│   ├── App.tsx
│   ├── hooks.ts
│   └── store.ts
├── css/
├── lib/
└── index.tsx
```

Har seller feature server data ishlatsa `slice.ts` va `selector.ts`ga ega bo‘ladi. Seller faqat o‘z product/order/message datalarini ko‘radi va mutate qiladi.

## 8. Route contract

Buyer:

| Route | Screen | Auth |
|---|---|---|
| `/` | HomePage | public |
| `/products` | Products | public |
| `/products/:productId` | ChosenProduct | public; mutation protected |
| `/cart` | CartPage | buyer |
| `/checkout` | CheckoutPage | buyer |
| `/orders` | OrdersPage | buyer |
| `/likes` | LikesPage | buyer |
| `/chat` | ChatPage | buyer |
| `/member-page` | UserPage | buyer |
| `/help` | HelpPage | public |
| `/about` | AboutPage | public |
| `/login` | Login | public |
| `/signup` | Signup | public |

Seller:

| Route | Screen |
|---|---|
| `/seller/login` | SellerLogin |
| `/seller/` yoki `/seller/overview` | OverviewPage |
| `/seller/products` | ProductsPage |
| `/seller/orders` | OrdersPage |
| `/seller/messages` | MessagesPage |
| `/seller/analytics` | AnalyticsPage |
| `/seller/settings` | SettingsPage |

Guest protected route/action uchun redirect:

```text
/login?next=<encoded current path and query>
```

`App.tsx` `/` uchun `HomeNavbar`, qolgan buyer route’lari uchun `OtherNavbar` ko‘rsatadi. Footer, auth modal, Basket drawer, mobile bottom nav va BackToTop buyer shell’da global turadi. Seller dashboard buyer shell ichida render qilinmaydi.

## 9. Domain type va enum contractlari

Asosiy role:

```ts
type Role = "buyer" | "seller" | "admin";
```

Product category:

```ts
type Category = "tshirts" | "hoodies" | "caps" | "cups";
```

Product status:

```ts
type ProductStatus = "active" | "draft" | "inactive";
```

Order status:

```ts
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
```

Status stringlari backend tasdig‘isiz o‘zgartirilmaydi.

Product normalizatsiyasi `toProduct()` orqali:

- `_id -> id` string;
- `sellerId` string;
- missing array -> `[]`;
- number/boolean qiymatlar aniq type;
- broken yoki bo‘sh image array uchun defensive fallback.

Cart item identity:

```text
product.id + color + size
```

Bir variant quantity’ni oshiradi; boshqa color yoki size alohida row bo‘ladi.

## 10. Context va persistence

`ContextProvider` kamida quyidagilarni beradi:

- `authMember`, `setAuthMember`;
- `basket`: `useBasket()` API;
- `orderBuilder`, `setOrderBuilder`;
- cart drawer holati;
- kerak bo‘lsa theme/language facade.

Persistent keylar mavjud loyiha bilan mos bo‘lishi kerak:

- `memberData` — Burak-compatible auth snapshot;
- `cartData` — Burak-compatible cart snapshot;
- `mnshop_blueprint-auth` — mavjud auth snapshot bo‘lsa saqlanadi;
- `mnshop_blueprint-store` — mavjud shop snapshot bo‘lsa saqlanadi;
- theme va language mavjud MNShop keylari bilan saqlanadi.

Migration davrida ikki format bo‘lsa, bitta canonical modelga defensive normalize qilinadi; foydalanuvchi cart/auth ma’lumoti jimgina o‘chirib yuborilmaydi.

Cart mutationlari React state va localStorage’ni birga yangilaydi:

- `onAdd`;
- `onRemove`;
- `onDelete`;
- `onDeleteAll`.

Order create/status mutationdan keyin `setOrderBuilder(new Date())` chaqiriladi. Order screen effect’i `orderBuilder`ga subscribe qiladi.

## 11. Service va API qatlami

Component endpoint string yig‘maydi va Axios’ni bevosita chaqirmaydi. Barcha HTTP `services/` orqali o‘tadi.

Base config:

```ts
export const serverApi = process.env.REACT_APP_API_URL ?? "http://localhost:3000";
```

Credential talab qiladigan request:

```ts
axios.get(url, { withCredentials: true });
axios.post(url, payload, { withCredentials: true });
```

MNShop API contract:

| Method | Endpoint | Vazifa |
|---|---|---|
| POST | `/api/auth/signin` | role-aware login |
| POST | `/api/auth/signup` | buyer/seller signup |
| POST | `/api/auth/logout` | session logout |
| GET | `/api/products` | catalog list/filter/search |
| POST | `/api/products/:slug/like` | buyer like/unlike |
| POST | `/api/products/:slug/view` | unique buyer view |
| GET | `/api/orders` | buyer orders |
| POST | `/api/orders` | create order |
| PATCH | `/api/orders/:id` | buyer pending cancel |
| GET | `/api/seller/products` | seller-owned products |
| POST | `/api/seller/products` | create product |
| PATCH | `/api/seller/products/:id` | edit/publish/draft product |
| DELETE | `/api/seller/products/:id` | soft-delete/inactive |
| GET | `/api/seller/orders` | seller-owned order items |
| PATCH | `/api/seller/orders/:id` | allowed fulfillment transition |

Backend boshqa base path ishlatsa service adapter o‘zgaradi; View/UI contracti o‘zgarmaydi.

## 12. Auth va security

- Session backend cookie orqali boshqariladi.
- UI’dagi role check faqat UX; backend har mutationni qayta tekshiradi.
- Buyer mutation faqat buyerga.
- Seller route seller/admin uchun; oddiy seller `sellerApproved=true` bo‘lishi kerak.
- Admin route faqat admin uchun.
- Seller product/order ownership serverda tekshiriladi.
- Client `sellerId`, `sold`, `views`, `likes`, authoritative total yoki initial order statusni belgilamaydi.
- Failed auth/mutation local snapshotni noto‘g‘ri success holatiga o‘tkazmaydi.

## 13. Order va checkout business flow

Checkout 4 bosqich:

```text
Summary -> Delivery -> Payment -> Confirm
```

Delivery: fullName, phone, address, city, zipCode, save checkbox.

Payment: Stripe, Payme, Click. Tanlangan method ko‘k border/background bilan ko‘rinadi.

Qoidalar:

- empty cart order yaratmaydi;
- required delivery fieldlari tekshiriladi;
- frontend total faqat display;
- server product price, stock, delivery va totalni qayta hisoblaydi;
- success’dan keyingina cart tozalanadi;
- failure’da cart saqlanadi;
- success’da `orderBuilder` yangilanadi va `/orders`ga o‘tiladi.

Buyer:

- faqat `pending` orderni cancel qila oladi;
- newest-first o‘z orderlarini ko‘radi;
- tracking mavjud bo‘lsa ko‘radi.

Seller transitionlari:

```text
pending -> processing -> shipped -> delivered
pending -> cancelled
processing -> cancelled
```

- Orqaga transition yo‘q.
- `shipped` uchun tracking number majburiy.
- Backend transition va ownershipni tekshiradi.

## 14. MNShop design source of truth

Burak dizayni ishlatilmaydi. Quyidagi MNShop tokenlari majburiy:

| Token | Qiymat |
|---|---:|
| `night` | `#0a0a0a` |
| `carbon` | `#111111` |
| `gold` | `#3b82f6` |
| `blue` | `#3b82f6` |
| `blue-hover` | `#2563eb` |
| `ember` | `#f43f5e` |
| dark text | `#f8fafc` |
| light background | `#f7f6f2` |
| light secondary | `#eeece6` |
| light text | `#141414` |

Muhim: `gold` tarixiy token nomi, amalda ko‘k. Sariqqa almashtirilmaydi.

Typography:

- body: Inter;
- heading/display: Poppins, 700–900;
- eyebrow/status: uppercase, bold, wide tracking.

Surface:

- `.glass`: translucent background, 1px border, 14px blur, yumshoq shadow;
- card/modal: `rounded-lg` equivalent;
- CTA/status/pill: `rounded-full` equivalent;
- header/catalog max width: 1440px;
- content max width: 1280px yoki 1152px, mavjud design reference bo‘yicha.

Motion:

- logo outer ring 6s linear;
- logo shine 5s repeat;
- product primary/secondary image crossfade 500ms;
- mobile drawer right’dan spring-equivalent motion;
- `prefers-reduced-motion` hurmat qilinadi.

## 15. Buyer design contract

### Shell

Tartib:

1. Sticky Header.
2. Main content, minimum viewport height.
3. Footer.
4. Global CartDrawer.
5. MobileBottomNav.
6. BackToTop.

### Header

- 64px, sticky, z-index 1000, translucent dark blur.
- Chapda brand tile, animated MNShop logo va wide’da brand nomi.
- Home, Products, Help, About.
- Active link ko‘k va pastki 1px line.
- Desktop search 2+ belgida maksimum 5 suggestion.
- Notification, likes, cart, profile/login, theme/language.
- Products route’da Hoodies, T-Shirts, Caps, Cups, Sale ikkinchi nav.
- Sale ember flame va `HOT` label.
- Mobile drawer o‘ngdan ochiladi.

### Homepage

Ketma-ketlik:

1. hero video/slider;
2. trust section;
3. category pills;
4. product sections;
5. best sellers;
6. brand film.

### Catalog va card

- Category hero slider.
- Count, sort, max price, color va size filter.
- Cups uchun size filter yo‘q.
- Mobile 1, tablet 2, wide 3 column.
- Product image aspect 4/5 va 500ms crossfade.
- White like action, ember sale badge.
- Category/Korea eyebrow, price va optional compare price.
- Add-to-cart square action, color dots, views va likes.
- Guest like/cart login redirect qiladi.

### Product detail

- Gallery, title, category, price/discount va metrics.
- Color, size, quantity va stock.
- Add cart, like va message seller.
- Auth buyer unique view yozadi.

### Orders, likes, chat va auth

- Orders card: ID, sana, total, item summary, status pill, timeline.
- Likes shared ProductCard grid’dan foydalanadi.
- Chat conversation list + active thread; mobile stacked.
- Login/signup role intent va `next` route’ni saqlaydi.
- Loading submit disabled va API error tushunarli.

## 16. Seller design contract

Seller root dark dashboard; buyer StoreShell ichida emas.

Layout:

- max width 1280px;
- desktop `260px + 1fr`;
- gap 24px;
- glass sidebar;
- desktop sticky top 24px;
- mobile/tablet stacked.

Sidebar nav:

- Overview;
- Products;
- Orders;
- Messages;
- Analytics;
- Settings.

Active tab blue background/qora text; inactive muted, hover glass/blue.

Overview:

- Total Sales, Revenue, Orders Today, Active Listings;
- Recent Activity va Quick Actions;
- statistika loaded state’dan, fake constant’dan emas.

Products:

- title/count/Add New Product;
- min-width 940px horizontal-scroll table;
- Name, Category, Price, Stock, Sold, Status, Actions;
- Edit, Draft/Publish, soft Delete;
- form: name, category, description, price, stock, colors, sizes, images, active/draft.

Orders:

- ID, buyer, product, qty, total, date, status, action;
- search ID/buyer/product/status bo‘yicha;
- pending yellow, processing blue, shipped purple, delivered emerald, cancelled rose.

Messages:

- conversation list va active thread;
- unread badge;
- buyer/seller qarama-qarshi bubble;
- ochilganda unread zero, send’dan keyin input empty.

Analytics:

- revenue, sold units, category va fulfillment real seller state’dan;
- zero data NaN/crash/infinite width bermaydi.

Settings:

- store/profile/shipping/preferences;
- dark glass design;
- save feedback;
- theme/language buyer bilan bir xil persistence.

Modal:

- fixed viewport;
- z-index 2000;
- black 70% blur overlay;
- max width 672px;
- max height 86vh;
- sticky header va focusable close;
- mobile padding 16px, vertical scroll.

## 17. Responsive contract

### Mobile `<768px`

- Header 64px, desktop nav hidden.
- Fixed 5-item bottom nav: Home, Products, Likes, Cart, Profile.
- Footer bottom padding 112px.
- Product grid 1 column.
- Seller sidebar content ustida.
- Table horizontal scroll, columnlar siqilmaydi.
- Modal viewport-safe va scrollable.

### Tablet `768–1023px`

- Bottom nav hidden.
- Product grid 2 column.
- Seller layout zaruratda stacked.

### Desktop `>=1024px`

- Desktop nav/search visible.
- Seller 260px + 1fr.
- Catalog filter sticky.
- Grid 2–3 column.

### Wide `>=1280px`

- Header brand text visible.
- Catalog 3 column.

Majburiy QA viewportlari: `390x844`, `768x1024`, `1440x900`.

## 18. Loading, empty, error va success

Har async feature quyidagilarga ega:

- loading: skeleton yoki muted progress, action disabled;
- empty: glass panel, izoh va relevant CTA;
- error: backend `message`, keyin fallback;
- success: aniq toast/feedback va kerakli refresh.

Failed checkout cartni tozalamaydi. Failed optimistic mutation local rowni success holatida qoldirmaydi.

## 19. Accessibility

- Icon-only button `aria-label` oladi.
- Keyboard focus aniq ko‘rinadi.
- Image meaningful `alt` oladi; dekorativ image `alt=""`.
- Status faqat rang bilan emas, matn bilan ham ko‘rsatiladi.
- Navigation uchun Link/NavLink, action uchun button.
- Modal close focusable.
- Form inputlari label/error bilan bog‘langan.
- Horizontal table keyboard va touch bilan scrollable.
- Reduced-motion preference hurmat qilinadi.

## 20. Coding qoidalari

- Componentlar kichik va bitta vazifali bo‘ladi.
- Type’lar `lib/types`, enumlar `lib/enums`da turadi.
- Shared API boundary `services/`da turadi.
- Feature action/reducer `slice.ts`, o‘qish qismi `selector.ts`da.
- `useAppDispatch` va `useAppSelector` typed hooklari ishlatiladi.
- API DTO va UI model bir xil deb taxmin qilinmaydi; mapper ishlatiladi.
- Optional backend fieldlar defensive o‘qiladi.
- CSS mavjud global MNShop token va class naming bilan yoziladi.
- Naming bir feature ichida izchil; generic `.active`, `.title` kabi collision-prone global selectorlar parent block bilan scope qilinadi.
- Mavjud ishlayotgan logic sababini tekshirmasdan “cleanup” qilinmaydi.
- Dirty worktree’dagi user o‘zgarishlari saqlanadi.

## 21. Implementatsiya tartibi

### 21.1. Majburiy qadamma-qadam approval gate

Agent barcha feature, component va CSS fayllarini birdaniga yozmaydi. Har bir kichik, tekshiriladigan bosqich oldidan foydalanuvchidan aniq ruxsat oladi.

Majburiy sikl:

```text
1. Keyingi bitta kichik bosqichni aytish
2. Qaysi file yaratilishi yoki o‘zgarishini ko‘rsatish
3. Nima implement qilinishini qisqa tushuntirish
4. "Davom ettirsam maylimi?" deb ruxsat so‘rash
5. Faqat foydalanuvchi "ha" degandan keyin o‘sha bosqichni bajarish
6. Natijani typecheck/lint yoki mos tekshiruv bilan tekshirish
7. Nima bajarilganini qisqa hisobot qilish
8. Navbatdagi bitta bosqich uchun yana ruxsat so‘rash
```

Foydalanuvchining bitta `ha` javobi faqat so‘ralgan bosqichga ruxsat beradi. Bu javob keyingi component, CSS, service, slice yoki boshqa filelarni avtomatik o‘zgartirishga umumiy ruxsat hisoblanmaydi.

Component va uning CSS’i alohida bosqichlar hisoblanadi. Masalan:

```text
Agent: Buyer header’dan boshlaymiz. Avval
`src/app/components/headers/Header.tsx` faylini yaratib,
navbar markup, auth holati va navigation logic’ini tashkil qilsam maylimi?

User: Ha.

Agent: Header component yaratildi va tekshirildi. Endi faqat
`src/css/navbar.css` ichida shu headerning desktop CSS qismini
agent.md dizayn tokenlari asosida yozsam maylimi?

User: Ha.

Agent: Desktop CSS tayyor. Endi headerning tablet/mobile responsive
qismini qo‘shsam maylimi?
```

Ruxsatsiz bajarilmaydigan ishlar:

- yangi component yoki screen yaratish;
- mavjud component logic’ini o‘zgartirish;
- CSS yaratish yoki o‘zgartirish;
- Redux slice/selector/store qo‘shish;
- Context yoki hook o‘zgartirish;
- service/API integration yozish;
- package/dependency yoki config o‘zgartirish;
- buyer bosqichidan seller bosqichiga o‘tish;
- bir bosqich bahonasida oldindan boshqa featurelarni ham yozish.

Bir bosqichda faqat o‘zaro ajratib bo‘lmaydigan minimal fayllar birga o‘zgartirilishi mumkin. Bunday holatda agent ruxsat so‘rashdan oldin barcha fayllarni aniq sanaydi va nega birga o‘zgarishi kerakligini tushuntiradi.

Agent foydalanuvchi tasdiqlamagan keyingi bosqichga o‘tmaydi. Agar oldingi bosqichda build xatosi aniqlansa, faqat o‘sha bosqich doirasidagi tuzatishni taklif qiladi va tuzatish materially boshqa filega tegsa, yana ruxsat so‘raydi.

### 21.2. Umumiy implementatsiya ketma-ketligi

1. Target source, route va git statusni o‘qish.
2. Amaldagi MNShop design token/shellni inventar qilish.
3. Type, enum va API contractlarni aniqlash.
4. Provider, Context, hook va persistence’ni tiklash.
5. Redux feature slice/selector/store’ni ulash.
6. Shared buyer komponentlari.
7. Home/catalog/detail/cart.
8. Checkout/orders/likes/chat/auth/profile.
9. Seller shell va overview.
10. Seller product CRUD va fulfillment.
11. Messages/analytics/settings.
12. Auth, role va ownership auditi.
13. Responsive/theme/accessibility QA.
14. Typecheck, test, build va screenshot comparison.

## 22. Taqiqlangan shortcutlar

- Static fake data bilan API’ni chetlab o‘tish.
- Barcha screenlarni bitta filega yig‘ish.
- Sellerlar data’sini aralashtirish.
- Client total’ga ishonish.
- Product hard-delete.
- Invalid status transition.
- Tracking’siz shipped qilish.
- Random rang/font/radius/spacing.
- `gold`ni sariq qilish.
- Logo yoki design systemni almashtirish.
- Desktopni qilib mobile’ni tashlash.
- Loading/empty/error/success state’larini tashlash.
- Client role checkni security deb hisoblash.
- Typecheck/build xatosini “unrelated” deb qoldirib tayyor deyish.

## 23. Verification

Buyer:

```bash
npm run build:shop
npm test -- --watchAll=false
```

Seller:

```bash
npm run build:seller
```

TypeScript alohida script qo‘shilgan bo‘lsa:

```bash
npm run typecheck
npm run typecheck:seller
```

Visual matrix:

- buyer home dark/light;
- catalog hoodie/sale;
- card normal/hover/liked;
- detail;
- cart empty/filled/drawer;
- checkout 4 step;
- order barcha status;
- auth va mobile menu/nav;
- seller Overview desktop/mobile;
- Products table/empty/add/edit;
- Orders barcha status;
- Messages;
- Analytics zero/populated;
- Settings dark/light.

## 24. Functional checklist

- [ ] Guest protected action login’ga ketadi va `next` saqlanadi.
- [ ] Buyer like/view/cart variant ishlaydi.
- [ ] Cart state va `cartData` birga yangilanadi.
- [ ] Auth Context va persisted member birga yangilanadi.
- [ ] Checkout validation va authoritative server total ishlaydi.
- [ ] Failure’da cart saqlanadi.
- [ ] Stock tekshiriladi/kamayadi, sold oshadi.
- [ ] Buyer faqat pending order cancel qiladi.
- [ ] Order mutation `orderBuilder`ni yangilaydi.
- [ ] Seller faqat o‘z data’sini ko‘radi/mutate qiladi.
- [ ] Product create/edit/draft/publish/soft-delete ishlaydi.
- [ ] Invalid transition rad etiladi.
- [ ] Shipped tracking’siz rad etiladi.
- [ ] Seller active product buyer catalog’da chiqadi.
- [ ] Dark/light va language refresh’dan keyin saqlanadi.
- [ ] Mobile’da overlap, clipping va accidental overflow yo‘q.
- [ ] Loading, empty, error va success state mavjud.
- [ ] Buyer va seller production build muvaffaqiyatli.

## 25. Definition of Done

Faqat quyidagilar to‘liq bajarilganda “100% tayyor” deyiladi:

1. Buyer va seller route’lari demo-only emas.
2. Har action real Context/Redux/service/API oqimiga bog‘langan.
3. Burak feature arxitekturasi qo‘llangan, lekin Burak dizayni ko‘chirilmagan.
4. MNShop vizual tili va amaldagi design 100% saqlangan.
5. Uch majburiy viewport’da overflow/overlap/clipping yo‘q.
6. Dark/light kontrasti to‘g‘ri.
7. Auth, role, ownership va transition backendda himoyalangan.
8. Loading, empty, error va success state’lari mavjud.
9. Buyer va seller typecheck/build muvaffaqiyatli.
10. Screenshot matrix bilan vizual parity tekshirilgan.
11. Buyer order va seller fulfillment bitta lifecycle contractidan foydalanadi.

Bitta band bajarilmasa ham agent “100% tayyor” deb hisobot bermaydi; bajarilmagan bandlarni aniq sanaydi.
