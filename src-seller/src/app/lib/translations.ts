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
  "Theme": { uz: "Mavzu", ko: "테마" },
  "Language": { uz: "Til", ko: "언어" },
  "Light mode": { uz: "Yorug' rejim", ko: "라이트 모드" },
  "Dark mode": { uz: "Qorong'i rejim", ko: "다크 모드" },
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
