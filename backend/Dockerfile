FROM node:20-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install --production && \
    npm audit fix --force && \
    apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
