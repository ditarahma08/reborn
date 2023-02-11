FROM node:14.13.0-alpine AS deps

WORKDIR /app/lib
COPY ./lib/fslightbox-react-pro-1.5.1.tgz ./

WORKDIR /app
COPY . .

ARG ARG_APP_MODE
ARG ARG_PREVIEW_API_URL

ENV APP_MODE=$ARG_APP_MODE
ENV PREVIEW_API_URL=$ARG_PREVIEW_API_URL

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]