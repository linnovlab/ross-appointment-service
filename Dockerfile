# Choisissez la version de Node.js adaptée à vos besoins
FROM node:20 as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn run build

# Etape d'exécution
FROM node:20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 5055

CMD ["node", "dist/main"]