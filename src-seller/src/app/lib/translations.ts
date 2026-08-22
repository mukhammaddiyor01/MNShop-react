export type SiteLanguage = "en" | "uz" | "ko";

export const languageNames: Record<SiteLanguage, string> = { en: "English", uz: "O'zbekcha", ko: "한국어" };

const entries: Record<string, { uz: string; ko: string }> = {
  Overview: { uz: "Umumiy", ko: "개요" },
  Products: { uz: "Mahsulotlar", ko: "상품" },
  Orders: { uz: "Buyurtmalar", ko: "주문" },
  Messages: { uz: "Xabarlar", ko: "메시지" },
  Analytics: { uz: "Analitika", ko: "분석" },
  Settings: { uz: "Sozlamalar", ko: "설정" },
  "Seller Studio": { uz: "Sotuvchi studiyasi", ko: "셀러 스튜디오" },
  "Seller Dashboard": { uz: "Sotuvchi paneli", ko: "셀러 대시보드" },
  "Products, orders, messages, and analytics in one place.": { uz: "Mahsulotlar, buyurtmalar, xabarlar va analitika bitta joyda.", ko: "상품, 주문, 메시지와 분석을 한곳에서 관리하세요." },
  "Continue as buyer": { uz: "Xaridor sifatida davom etish", ko: "구매자로 계속하기" },
  "Sign out": { uz: "Chiqish", ko: "로그아웃" },
  "Signing out…": { uz: "Chiqilmoqda…", ko: "로그아웃 중…" },
  "Add Product": { uz: "Mahsulot qo'shish", ko: "상품 추가" },
  "Update Orders": { uz: "Buyurtmalarni yangilash", ko: "주문 업데이트" },
  "Reply Messages": { uz: "Xabarlarga javob berish", ko: "메시지 답변" },
  "Total Sales": { uz: "Jami sotuvlar", ko: "총 판매량" },
  Revenue: { uz: "Daromad", ko: "매출" },
  "Orders Today": { uz: "Bugungi buyurtmalar", ko: "오늘 주문" },
  "Active Listings": { uz: "Faol mahsulotlar", ko: "활성 상품" },
  "Store performance": { uz: "Do'kon ko'rsatkichlari", ko: "스토어 성과" },
  "Live product and order signals from your seller account.": { uz: "Seller hisobingizdagi mahsulot va buyurtma ko'rsatkichlari.", ko: "셀러 계정의 실시간 상품 및 주문 지표입니다." },
  "Paid revenue": { uz: "To'langan daromad", ko: "결제 완료 매출" },
  "Product views": { uz: "Mahsulot ko'rishlari", ko: "상품 조회수" },
  "Product likes": { uz: "Mahsulot yoqtirishlari", ko: "상품 좋아요" },
  "Buyer interest signals": { uz: "Xaridor qiziqishi", ko: "구매자 관심 지표" },
  "Top listings": { uz: "Eng yaxshi mahsulotlar", ko: "인기 상품" },
  "Ranked by sales, views and likes.": { uz: "Sotuv, ko'rish va yoqtirishlar bo'yicha.", ko: "판매, 조회수와 좋아요 기준입니다." },
  "Order pipeline": { uz: "Buyurtma jarayoni", ko: "주문 진행 현황" },
  "Delivery status across your current orders.": { uz: "Joriy buyurtmalaringiz yetkazish holati.", ko: "현재 주문의 배송 상태입니다." },
  "Fulfillment desk": { uz: "Buyurtmalar stoli", ko: "주문 처리 데스크" },
  "Manage paid orders, shipping progress, and tracking details.": { uz: "To'langan buyurtmalar, yetkazish va trackingni boshqaring.", ko: "결제 주문과 배송 진행, 운송장 정보를 관리하세요." },
  "Search orders": { uz: "Buyurtmalarni qidirish", ko: "주문 검색" },
  "Order": { uz: "Buyurtma", ko: "주문" },
  "Buyer": { uz: "Xaridor", ko: "구매자" },
  "Product": { uz: "Mahsulot", ko: "상품" },
  Qty: { uz: "Soni", ko: "수량" },
  Total: { uz: "Jami", ko: "합계" },
  Date: { uz: "Sana", ko: "날짜" },
  Tracking: { uz: "Tracking", ko: "운송장" },
  Status: { uz: "Holat", ko: "상태" },
  Update: { uz: "Yangilash", ko: "업데이트" },
  "Not shipped": { uz: "Jo'natilmagan", ko: "미배송" },
  "Saving…": { uz: "Saqlanmoqda…", ko: "저장 중…" },
  Completed: { uz: "Yakunlangan", ko: "완료" },
  "Awaiting payment": { uz: "To'lov kutilmoqda", ko: "결제 대기" },
  "Recent Activity": { uz: "So'nggi faoliyat", ko: "최근 활동" },
  "Quick Actions": { uz: "Tezkor amallar", ko: "빠른 작업" },
  "Loading dashboard…": { uz: "Dashboard yuklanmoqda…", ko: "대시보드 로딩 중…" },
  "No order activity yet.": { uz: "Hozircha buyurtma faolligi yo'q.", ko: "아직 주문 활동이 없습니다." },
  "Catalog management": { uz: "Katalog boshqaruvi", ko: "카탈로그 관리" },
  "Search products": { uz: "Mahsulotlarni qidirish", ko: "상품 검색" },
  "Name, category, or status": { uz: "Nomi, kategoriya yoki holati", ko: "이름, 카테고리 또는 상태" },
  "Add New Product": { uz: "Yangi mahsulot qo'shish", ko: "새 상품 추가" },
  "Loading products…": { uz: "Mahsulotlar yuklanmoqda…", ko: "상품 로딩 중…" },
  "You have not created any products yet.": { uz: "Siz hali mahsulot yaratmagansiz.", ko: "아직 등록한 상품이 없습니다." },
  Category: { uz: "Kategoriya", ko: "카테고리" },
  Price: { uz: "Narx", ko: "가격" },
  Stock: { uz: "Ombor", ko: "재고" },
  Sold: { uz: "Sotilgan", ko: "판매" },
  Views: { uz: "Ko'rishlar", ko: "조회수" },
  Likes: { uz: "Yoqtirishlar", ko: "좋아요" },
  Action: { uz: "Amal", ko: "작업" },
  Pause: { uz: "To'xtatish", ko: "일시중지" },
  Publish: { uz: "Nashr qilish", ko: "게시" },
  Edit: { uz: "Tahrirlash", ko: "수정" },
  ACTIVE: { uz: "FAOL", ko: "활성" },
  PAUSE: { uz: "TO'XTATILGAN", ko: "중지" },
  PENDING: { uz: "KUTILMOQDA", ko: "대기" },
  PROCESSING: { uz: "TAYYORLANMOQDA", ko: "처리 중" },
  SHIPPED: { uz: "JO'NATILGAN", ko: "배송 중" },
  DELIVERED: { uz: "YETKAZILGAN", ko: "배송 완료" },
  "Catalog editor": { uz: "Katalog tahrirlash", ko: "카탈로그 편집" },
  "Edit Product": { uz: "Mahsulotni tahrirlash", ko: "상품 수정" },
  "Product name": { uz: "Mahsulot nomi", ko: "상품명" },
  Description: { uz: "Tavsif", ko: "설명" },
  "T-shirt": { uz: "Futbolka", ko: "티셔츠" },
  Hoodie: { uz: "Hudi", ko: "후드티" },
  Cap: { uz: "Kepka", ko: "모자" },
  Cup: { uz: "Krujka", ko: "컵" },
  Active: { uz: "Faol", ko: "활성" },
  Draft: { uz: "Qoralama", ko: "초안" },
  "Price (KRW)": { uz: "Narx (KRW)", ko: "가격 (KRW)" },
  "Put this product on sale": { uz: "Mahsulotni chegirmaga qo'yish", ko: "상품 할인 적용" },
  "Sale price (KRW)": { uz: "Chegirma narxi (KRW)", ko: "할인가 (KRW)" },
  "Turn this on to set a discounted buyer price.": { uz: "Xaridor uchun chegirmali narx belgilash uchun yoqing.", ko: "구매자 할인가를 설정하려면 켜세요." },
  "Available colors": { uz: "Mavjud ranglar", ko: "사용 가능한 색상" },
  "Available sizes": { uz: "Mavjud o'lchamlar", ko: "사용 가능한 사이즈" },
  Black: { uz: "Qora", ko: "검정" },
  White: { uz: "Oq", ko: "흰색" },
  Red: { uz: "Qizil", ko: "빨강" },
  Blue: { uz: "Ko'k", ko: "파랑" },
  "Product images": { uz: "Mahsulot rasmlari", ko: "상품 이미지" },
  "Save Product": { uz: "Mahsulotni saqlash", ko: "상품 저장" },
  "Seller account": { uz: "Sotuvchi hisobi", ko: "셀러 계정" },
  "Keep the store details your buyers see accurate and up to date.": { uz: "Xaridorlar ko'radigan do'kon ma'lumotlarini aniq va yangilangan holda saqlang.", ko: "구매자에게 표시되는 스토어 정보를 정확하게 유지하세요." },
  "Approved seller account": { uz: "Tasdiqlangan sotuvchi hisobi", ko: "승인된 셀러 계정" },
  "Square JPG, PNG, or WebP. This image appears with your seller profile.": { uz: "Kvadrat JPG, PNG yoki WebP. Bu rasm sotuvchi profilingizda ko'rinadi.", ko: "정사각형 JPG, PNG 또는 WebP. 셀러 프로필에 표시됩니다." },
  "Choose photo": { uz: "Rasm tanlash", ko: "사진 선택" },
  "Loading your account details…": { uz: "Hisob ma'lumotlari yuklanmoqda…", ko: "계정 정보 로딩 중…" },
  "Store name": { uz: "Do'kon nomi", ko: "스토어 이름" },
  "Email address": { uz: "Email manzil", ko: "이메일 주소" },
  "Phone number": { uz: "Telefon raqami", ko: "전화번호" },
  "Store location": { uz: "Do'kon manzili", ko: "스토어 위치" },
  "About your store": { uz: "Do'koningiz haqida", ko: "스토어 소개" },
  "Tell buyers a little about your store.": { uz: "Xaridorlarga do'koningiz haqida qisqacha yozing.", ko: "구매자에게 스토어를 소개하세요." },
  "Changes saved to your seller account.": { uz: "O'zgarishlar sotuvchi hisobiga saqlandi.", ko: "변경사항이 셀러 계정에 저장되었습니다." },
  "Save changes": { uz: "O'zgarishlarni saqlash", ko: "변경사항 저장" },
  "Theme": { uz: "Mavzu", ko: "테마" },
  "Language": { uz: "Til", ko: "언어" },
  "Light mode": { uz: "Yorug' rejim", ko: "라이트 모드" },
  "Dark mode": { uz: "Qorong'i rejim", ko: "다크 모드" },
};

export function translateText(value: string, language: SiteLanguage): string {
  const source = entries[value]
    ? value
    : Object.keys(entries).find((key) => entries[key].uz === value || entries[key].ko === value);
  if (!source) return value;
  if (language === "en") return source;
  return entries[source][language];
}

export function translateUiText(value: string, language: SiteLanguage): string {
  const direct = translateText(value, language);
  if (direct !== value) return direct;
  const visibleProducts = value.match(/^(\d+) visible products$/);
  if (visibleProducts) return language === "uz" ? `${visibleProducts[1]} ta ko'rinadigan mahsulot` : `표시 상품 ${visibleProducts[1]}개`;
  const uzVisibleProducts = value.match(/^(\d+) ta ko'rinadigan mahsulot$/);
  const koVisibleProducts = value.match(/^표시 상품 (\d+)개$/);
  if (language === "en" && (uzVisibleProducts || koVisibleProducts)) return `${(uzVisibleProducts || koVisibleProducts)![1]} visible products`;
  const itemSummary = value.match(/^(\d+) items · (.+)$/);
  if (itemSummary) return language === "uz" ? `${itemSummary[1]} ta mahsulot · ${itemSummary[2]}` : `상품 ${itemSummary[1]}개 · ${itemSummary[2]}`;
  const uzItemSummary = value.match(/^(\d+) ta mahsulot · (.+)$/);
  const koItemSummary = value.match(/^상품 (\d+)개 · (.+)$/);
  if (language === "en" && (uzItemSummary || koItemSummary)) { const match = (uzItemSummary || koItemSummary)!; return `${match[1]} items · ${match[2]}`; }
  const selectedImages = value.match(/^(\d+)\/10 selected$/);
  if (selectedImages) return language === "uz" ? `${selectedImages[1]}/10 tanlandi` : `${selectedImages[1]}/10 선택됨`;
  const translatedSelectedImages = value.match(/^(\d+)\/10 (?:tanlandi|선택됨)$/);
  if (language === "en" && translatedSelectedImages) return `${translatedSelectedImages[1]}/10 selected`;
  return value;
}

export function translateTree(root: Node, language: SiteLanguage): void {
  const elements = root.nodeType === Node.ELEMENT_NODE
    ? [root as Element, ...Array.from((root as Element).querySelectorAll("[placeholder], [title], [aria-label]"))]
    : [];
  elements.forEach((element) => {
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value || element.closest("[data-no-translate]")) return;
      const translated = translateUiText(value, language);
      if (translated !== value) element.setAttribute(attribute, translated);
    });
  });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const parent = text.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) || parent.closest("[data-no-translate]")) continue;
    const source = text.data.trim();
    if (!source) continue;
    const translated = translateUiText(source, language);
    if (translated === source) continue;
    const leading = text.data.match(/^\s*/)?.[0] || "";
    const trailing = text.data.match(/\s*$/)?.[0] || "";
    text.data = `${leading}${translated}${trailing}`;
  }
}
