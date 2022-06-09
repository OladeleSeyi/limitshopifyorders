FROM node:14 AS base
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install 
# && mv node_modules ../
COPY . .
EXPOSE 8081
RUN chown -R node /usr/src/app
USER node
RUN yarn build 
CMD ["yarn", "start"]
