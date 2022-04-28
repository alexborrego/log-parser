FROM node:alpine
#RUN mkdir /app
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
#CMD ["npm", "start"]
CMD node ./src/app.js