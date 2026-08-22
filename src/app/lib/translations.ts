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
};

export function translateText(value: string, language: SiteLanguage): string {
  if (language === "en") return value;
  return entries[value]?.[language] || value;
}

const originalText = new WeakMap<Text, string>();

export function translateTree(root: Node, language: SiteLanguage): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const parent = text.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) || parent.closest("[data-no-translate]")) continue;
    const source = originalText.get(text) || text.data.trim();
    if (!source) continue;
    originalText.set(text, source);
    const leading = text.data.match(/^\s*/)?.[0] || "";
    const trailing = text.data.match(/\s*$/)?.[0] || "";
    text.data = `${leading}${translateText(source, language)}${trailing}`;
  }
}
