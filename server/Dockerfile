FROM node:12.18.2-alpine3.11

RUN echo 'Start Building Local Web Music...'
RUN node -v

RUN pwd
#RUN ./build.sh
ADD dist.tar /app

CMD npm start --prefix /app
