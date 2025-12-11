FROM node:20-alpine

RUN addgroup -S app && adduser -S app -G app

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

USER app

CMD ["npm", "start"]
