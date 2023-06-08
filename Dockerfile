FROM node:16.14.0
WORKDIR /ccp
COPY package*.json ./
COPY prisma ./prisma/
# COPY nodemon.json ./nodemon.json
COPY .env ./.env
COPY tsconfig.json ./
COPY . ./

# install pnpm for using insteand of npm
# RUN npm install -g yarn
RUN yarn install
# RUN npx prisma generate
# RUN yarn db:sync
RUN npx prisma migrate dev 
RUN yarn prisma generate
EXPOSE 5555
CMD ["yarn", "start:dev", ""]