FROM node:16.20.2-alpine
ENV NODE_ENV=production
WORKDIR /server 
COPY package.json /server 
COPY package-lock.json /server
RUN npm install --production 
COPY . /server
EXPOSE 8080
CMD ["npm", "start"]
