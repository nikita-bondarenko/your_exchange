# app/Dockerfile
FROM node:20

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm build

# Создаём data с правами
RUN mkdir -p /usr/src/app/data && chmod 777 /usr/src/app/data

EXPOSE 3000

CMD ["npm", "run", "start"]