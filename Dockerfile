FROM node:16
WORKDIR /notionapi
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]