

FROM node:16.14.0
WORKDIR /ccp
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./.env
COPY tsconfig.json ./
COPY . ./
COPY nest-cli.json ./
RUN yarn install
CMD ["yarn", "start"]