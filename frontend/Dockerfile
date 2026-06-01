# Usamos a imagem oficial do Node
FROM node:24-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração primeiro
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta
EXPOSE 3000

# Rodando com --host para o Docker conseguir rotear o tráfego
CMD ["npm", "run", "dev", "--", "--host"]