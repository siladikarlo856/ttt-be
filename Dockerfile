FROM node:20-alpine as builder

RUN npm install -g @nestjs/cli

# Create app directory
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm prune

# FROM node:20-alpine as runner
# WORKDIR /app
# COPY --from=builder /app/dist .
# COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start:prod"]
