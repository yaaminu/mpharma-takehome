FROM node:11.9.0

ADD . /app 
WORKDIR  /app 

RUN npm install typescript -g
RUN npm install -y 
RUN tsc -p "./tsconfig.json"

EXPOSE 5000 

CMD [ "npm", "start"]

