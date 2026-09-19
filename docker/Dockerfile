# syntax=docker/dockerfile:1

# Build vositalari faqat oraliq stage ichida qoladi.
FROM node:22-bookworm-slim AS frontend
WORKDIR /app/mnshop-react
COPY mnshop-react/package.json mnshop-react/yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY mnshop-react/src-seller/package.json mnshop-react/src-seller/yarn.lock ./src-seller/
RUN yarn --cwd src-seller install --frozen-lockfile --non-interactive
COPY mnshop-react/ ./
# CRA qiymatlarni build paytida JavaScript ichiga yozadi; bu yerga secret kiritilmaydi.
ARG PUBLIC_SITE_URL=https://mnshop.uz
ARG PUBLIC_API_URL=https://mnshop.uz
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_API_URL=$PUBLIC_API_URL \
    REACT_APP_SELLER_PORTAL_URL=$PUBLIC_SITE_URL \
    REACT_APP_BUYER_STOREFRONT_URL=$PUBLIC_SITE_URL \
    REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
RUN yarn build:all

# Backend TypeScript kodi JavaScriptga kompilyatsiya qilinadi.
FROM node:22-bookworm-slim AS backend
WORKDIR /app/MNShop
COPY MNShop/package.json MNShop/package-lock.json ./
RUN npm ci
COPY MNShop/tsconfig.json ./
COPY MNShop/src/ ./src/
RUN npm run build && npm prune --omit=dev

# Faqat ishlash uchun kerakli fayllar: source kod va build dependencylar yo‘q.
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=1213
WORKDIR /app/MNShop
COPY --from=backend /app/MNShop/package.json ./
COPY --from=backend /app/MNShop/node_modules ./node_modules/
COPY --from=backend /app/MNShop/dist ./dist/
# tsc EJS, rasm va CSS fayllarni ko‘chirmaydi, shuning uchun ular alohida olinadi.
COPY --from=backend /app/MNShop/src/views ./dist/views/
COPY --from=backend /app/MNShop/src/public ./dist/public/
# Backenddagi sibling papka yo‘llari saqlanadi: /app/MNShop va /app/mnshop-react.
COPY --from=frontend /app/mnshop-react/build /app/mnshop-react/build/
COPY --from=frontend /app/mnshop-react/src-seller/build /app/mnshop-react/src-seller/build/
RUN mkdir -p uploads && chown node:node uploads
USER node
EXPOSE 1213
# Restartda qayta install/build qilinmaydi; tayyor backend ishga tushadi.
CMD ["node", "dist/server.js"]
