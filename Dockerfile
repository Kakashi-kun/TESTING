FROM quay.io/raysenpai69/nezuko:latest

WORKDIR /root/nezuko

COPY . /root/nezuko

EXPOSE 8000

RUN yarn install

CMD ["yarn", "start"]
