FROM node:12.18.2-alpine3.11

RUN echo '开始构建 Locweb Music'
RUN node -v

RUN pwd
#RUN ./build.sh
ADD dist.tar /app

CMD npm start --prefix /app
