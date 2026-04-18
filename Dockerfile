FROM node:20-alpine
LABEL maintainer="larbinos740@proton.me"
LABEL description="Hermes Agent Mission Dashboard"
WORKDIR /app

COPY package*.json ./
RUN npm install --production && apk add --no-cache wget

COPY server.js ./
COPY public ./public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ && exit 0
CMD ["node", "server.js"]
