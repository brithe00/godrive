FROM mcr.microsoft.com/playwright

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY playwright.config.ts /app/playwright.config.ts

COPY tests/ /app/tests/

RUN npx playwright install

CMD ["npx", "playwright", "test"]