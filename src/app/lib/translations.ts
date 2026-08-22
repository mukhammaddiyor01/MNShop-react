export type SiteLanguage = "en" | "uz" | "ko";

export const languageNames: Record<SiteLanguage, string> = {
  en: "English",
  uz: "O'zbekcha",
  ko: "한국어",
};

const entries: Record<string, { uz: string; ko: string }> = {
  Home: { uz: "Bosh sahifa", ko: "홈" },
  Products: { uz: "Mahsulotlar", ko: "상품" },
  Orders: { uz: "Buyurtmalar", ko: "주문" },
  Help: { uz: "Yordam", ko: "도움말" },
  About: { uz: "Biz haqimizda", ko: "소개" },
  "My Page": { uz: "Profilim", ko: "내 페이지" },
  "Sign In": { uz: "Kirish", ko: "로그인" },
  "Sign In / Sign Up": { uz: "Kirish / Ro'yxatdan o'tish", ko: "로그인 / 회원가입" },
  "Liked items": { uz: "Yoqtirganlar", ko: "찜한 상품" },
  Cart: { uz: "Savat", ko: "장바구니" },
  Likes: { uz: "Yoqtirganlar", ko: "찜" },
  Profile: { uz: "Profil", ko: "프로필" },
  "Search MNShop Products": { uz: "MNShop mahsulotlaridan qidiring", ko: "MNShop 상품 검색" },
  "Open menu": { uz: "Menyuni ochish", ko: "메뉴 열기" },
  "Close menu": { uz: "Menyuni yopish", ko: "메뉴 닫기" },
  "Add to Cart": { uz: "Savatga qo'shish", ko: "장바구니 담기" },
  "Buy Now": { uz: "Hozir xarid qilish", ko: "바로 구매" },
  Description: { uz: "Tavsif", ko: "설명" },
  Reviews: { uz: "Sharhlar", ko: "리뷰" },
  Delivery: { uz: "Yetkazib berish", ko: "배송" },
  "Size guide": { uz: "O'lcham qo'llanmasi", ko: "사이즈 가이드" },
  Returns: { uz: "Qaytarish", ko: "반품" },
  "Secure payment": { uz: "Xavfsiz to'lov", ko: "안전 결제" },
  "Order tracking": { uz: "Buyurtmani kuzatish", ko: "주문 추적" },
  "Product questions": { uz: "Mahsulot savollari", ko: "상품 문의" },
  "Our sellers": { uz: "Sotuvchilarimiz", ko: "판매자" },
  "Meet our sellers": { uz: "Sotuvchilar bilan tanishing", ko: "판매자 만나기" },
  "Message a seller": { uz: "Sotuvchiga yozish", ko: "판매자에게 문의" },
  "Theme": { uz: "Mavzu", ko: "테마" },
  "Language": { uz: "Til", ko: "언어" },
  "Light mode": { uz: "Yorug' rejim", ko: "라이트 모드" },
  "Dark mode": { uz: "Qorong'i rejim", ko: "다크 모드" },
  "English": { uz: "Ingliz tili", ko: "영어" },
  "O'zbekcha": { uz: "O'zbekcha", ko: "우즈베크어" },
  "한국어": { uz: "Koreys tili", ko: "한국어" },
  "T-Shirts": { uz: "Futbolkalar", ko: "티셔츠" },
  "T-shirts": { uz: "Futbolkalar", ko: "티셔츠" },
  Hoodies: { uz: "Hudilar", ko: "후드티" },
  Caps: { uz: "Kepkalar", ko: "모자" },
  Cups: { uz: "Krujkalar", ko: "컵" },
  Sale: { uz: "Chegirma", ko: "세일" },
  "See all": { uz: "Barchasini ko'rish", ko: "전체 보기" },
  "Category edit": { uz: "Kategoriya tanlovi", ko: "카테고리 에디트" },
  "Community favourites": { uz: "Xaridorlar tanlovi", ko: "커뮤니티 인기 상품" },
  "Best sellers, right now.": { uz: "Hozir eng ko'p tanlanayotganlar.", ko: "지금 가장 사랑받는 상품." },
  "View the collection": { uz: "Kolleksiyani ko'rish", ko: "컬렉션 보기" },
  "Best Seller": { uz: "Eng ko'p sotilgan", ko: "베스트셀러" },
  "Last sizes": { uz: "So'nggi o'lchamlar", ko: "마지막 사이즈" },
  "Sale, without the noise.": { uz: "Ortiqcha shovqinsiz chegirma.", ko: "복잡함 없이, 세일." },
  "Shop sale": { uz: "Chegirmani ko'rish", ko: "세일 쇼핑" },
  "Active buyers": { uz: "Faol xaridorlar", ko: "활성 구매자" },
  "Average rating": { uz: "O'rtacha reyting", ko: "평균 평점" },
  "Orders delivered": { uz: "Yetkazilgan buyurtmalar", ko: "배송 완료 주문" },
  "Worn by our growing community.": { uz: "O'sib borayotgan hamjamiyatimiz tanlovi.", ko: "성장하는 커뮤니티가 함께 입습니다." },
  "Buyers across Uzbekistan are discovering independent Korean streetwear, tracking every order, and sharing what fits.": { uz: "O'zbekiston bo'ylab xaridorlar mustaqil koreys streetwear mahsulotlarini topmoqda, har bir buyurtmani kuzatmoqda va o'ziga mos tanlovlarni ulashmoqda.", ko: "우즈베키스탄 전역의 구매자들이 독립 한국 스트리트웨어를 발견하고 주문을 추적하며 자신에게 맞는 스타일을 공유합니다." },
  "Trusted by active shoppers": { uz: "Faol xaridorlar ishonchi", ko: "활성 구매자들의 신뢰" },
  "Small Korean studios. Clear buying from Uzbekistan.": { uz: "Kichik koreys studiyalari. O'zbekistondan oson xarid.", ko: "작은 한국 스튜디오. 우즈베키스탄에서 명확한 쇼핑." },
  "Every seller controls their collection. But MNShop can control product information, order contolling, and conversation between buyer and seller.": { uz: "Har bir sotuvchi o'z kolleksiyasini boshqaradi. MNShop mahsulot ma'lumoti, buyurtma nazorati va xaridor bilan sotuvchi muloqotini bir joyda saqlaydi.", ko: "각 판매자는 컬렉션을 관리하고 MNShop은 상품 정보, 주문과 구매자-판매자 대화를 한곳에서 관리합니다." },
  "Verified sellers": { uz: "Tasdiqlangan sotuvchilar", ko: "인증 판매자" },
  "Can see the status of Seller and the owner of Product.": { uz: "Sotuvchi holati va mahsulot egasi ochiq ko'rsatiladi.", ko: "판매자 상태와 상품 소유자를 확인할 수 있습니다." },
  "Delivery updates": { uz: "Yetkazish yangiliklari", ko: "배송 업데이트" },
  "Delivery process will be showen.": { uz: "Yetkazib berish jarayoni ko'rsatiladi.", ko: "배송 진행 상황을 확인할 수 있습니다." },
  "Direct answers": { uz: "Bevosita javoblar", ko: "직접 답변" },
  "If you have questions about size, material and quantity of product, Contact Seller.": { uz: "O'lcham, material va mahsulot soni haqida savol bo'lsa sotuvchiga yozing.", ko: "사이즈, 소재와 수량은 판매자에게 직접 문의하세요." },
  "Quick Links": { uz: "Tezkor havolalar", ko: "빠른 링크" },
  FAQ: { uz: "Ko'p so'raladigan savollar", ko: "자주 묻는 질문" },
  "Size Guide": { uz: "O'lcham qo'llanmasi", ko: "사이즈 가이드" },
  "Return Policy": { uz: "Qaytarish siyosati", ko: "반품 정책" },
  Contact: { uz: "Aloqa", ko: "연락처" },
  "Our Goal: Customer satisfaction and integrity": { uz: "Maqsadimiz: mijoz mamnuniyati va halollik", ko: "우리의 목표: 고객 만족과 신뢰" },
  "T-shirts, hoodies, caps, and cups with a design made by you Alone!": { uz: "Faqat siz yaratgan dizayndagi futbolka, hudi, kepka va krujkalar!", ko: "오직 당신이 만든 디자인의 티셔츠, 후드티, 모자와 컵!" },
  "Seoul, South Korea": { uz: "Seul, Janubiy Koreya", ko: "서울, 대한민국" },
  "Privacy Policy": { uz: "Maxfiylik siyosati", ko: "개인정보 처리방침" },
  "Terms of Service": { uz: "Foydalanish shartlari", ko: "이용약관" },
  "© 2024 MNShop. All rights reserved.": { uz: "© 2024 MNShop. Barcha huquqlar himoyalangan.", ko: "© 2024 MNShop. 모든 권리 보유." },
  "Midnight Seoul Hoodie": { uz: "Midnight Seoul hudisi", ko: "미드나잇 서울 후드티" },
  "Blueprint Oversized Tee": { uz: "Blueprint oversize futbolkasi", ko: "블루프린트 오버사이즈 티셔츠" },
  "Seoul Signature Cap": { uz: "Seoul Signature kepkasi", ko: "서울 시그니처 캡" },
  "MN Studio Cup": { uz: "MN Studio krujkasi", ko: "MN 스튜디오 컵" },
};

export function translateText(value: string, language: SiteLanguage): string {
  const source = entries[value]
    ? value
    : Object.keys(entries).find((key) => entries[key].uz === value || entries[key].ko === value);
  if (!source) return value;
  if (language === "en") return source;
  return entries[source][language];
}

const numberedSection = /^(\d+) \/ (.+)$/;

export function translateUiText(value: string, language: SiteLanguage): string {
  const direct = translateText(value, language);
  if (direct !== value) return direct;
  const match = value.match(numberedSection);
  if (match) return `${match[1]} / ${translateText(match[2], language)}`;
  return value;
}

const productWords: Record<string, { uz: string; ko: string }> = {
  Hoodie: { uz: "Hudi", ko: "후드티" },
  Hoodies: { uz: "Hudilar", ko: "후드티" },
  Tee: { uz: "Futbolka", ko: "티셔츠" },
  "T-Shirt": { uz: "Futbolka", ko: "티셔츠" },
  Cap: { uz: "Kepka", ko: "모자" },
  Cup: { uz: "Krujka", ko: "컵" },
  Oversized: { uz: "Oversize", ko: "오버사이즈" },
  Classic: { uz: "Klassik", ko: "클래식" },
  Black: { uz: "Qora", ko: "블랙" },
  White: { uz: "Oq", ko: "화이트" },
  Blue: { uz: "Ko'k", ko: "블루" },
};

function translateProductName(value: string, language: SiteLanguage): string {
  let result = value;
  Object.entries(productWords).forEach(([source, translated]) => {
    const candidates = [source, translated.uz, translated.ko];
    candidates.forEach((candidate) => {
      result = result.replace(new RegExp(candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), language === "en" ? source : translated[language]);
    });
  });
  return result;
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
    const isProductName = parent.matches(".mnshop-product-card h3, .mnshop-product-detail h1");
    const translated = isProductName
      ? translateProductName(translateUiText(source, language), language)
      : translateUiText(source, language);
    if (translated === source) continue;
    const leading = text.data.match(/^\s*/)?.[0] || "";
    const trailing = text.data.match(/\s*$/)?.[0] || "";
    text.data = `${leading}${translated}${trailing}`;
  }
}
