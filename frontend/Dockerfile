FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG REACT_APP_GOOGLE_CLIENT_ID=""
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
RUN npm run build

RUN npm install -g serve

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
