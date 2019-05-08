FROM node:11.9.0

RUN npm install typescript -g
ADD 'package.json' 'package-lock.json' /app/ 
WORKDIR  /app 
RUN npm install

ADD . /app 
RUN tsc -p "./tsconfig.json"

EXPOSE 5000 

CMD ["npm", "start"]

