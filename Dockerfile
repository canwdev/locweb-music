FROM node:12.18.2-alpine3.11

RUN echo '开始构建 LocwebMusic'
RUN node -v

RUN pwd
#RUN ./build.sh
ADD dists.tar /dist

CMD npm start --prefix /dist
