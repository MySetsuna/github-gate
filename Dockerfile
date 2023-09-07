FROM node:16.20.2-alpine
ENV NODE_ENV=production
RUN npm install --production
CMD ["npm", "start"]
