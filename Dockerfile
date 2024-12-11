FROM node:16.19.0
COPY . .
#RUN npm install socket.io moment teltonika-parser-ex dotenv jsonwebtoken moment-timezone axios exceljs kafkajs firebase-admin mongoose=6.0.7 mongoose-paginate-v2 bcryptjs
RUN npm install
CMD ["node","index.js"]
EXPOSE 9020
