FROM node:alpine:3.17
WORKDIR /app
COPY . /app
RUN npm install
ENV NODE_ENV=production
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "start"]