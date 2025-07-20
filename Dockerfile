# Usa uma imagem oficial do Node.js como base.
FROM node:18-alpine

# Define o diretório de trabalho dentro do container.
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências.
COPY package*.json ./

# Instala as dependências de produção.
RUN npm install --only=production

# Copia os arquivos do projeto para o diretório de trabalho.
COPY . .

# Expõe a porta que o app vai usar.
EXPOSE 3000

# Comando para rodar a aplicação.
CMD ["node", "src/app.js"]