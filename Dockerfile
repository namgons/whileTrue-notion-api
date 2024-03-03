FROM node:18-alpine
WORKDIR /notionapi
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]