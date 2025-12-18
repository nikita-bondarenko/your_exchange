FROM node:20

WORKDIR /usr/src/app

ARG NEXT_PUBLIC_PROJECT_NAME
ARG TELEGRAM_BOT_TOKEN

ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN

ENV NEXT_PUBLIC_PROJECT_NAME=$NEXT_PUBLIC_PROJECT_NAME

RUN npm i -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm build

RUN mkdir -p /usr/src/app/data 

EXPOSE 3000

CMD ["npm", "run", "start"]