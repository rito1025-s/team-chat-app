FROM node:18-slim

# Prismaに必要なOpenSSLなどの部品を追加インストールする命令
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# 一番下を nodemon から通常の node に変更
CMD ["npm", "start"]