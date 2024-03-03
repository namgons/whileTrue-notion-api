FROM node:18
WORKDIR /notionapi
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]