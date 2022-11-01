# base image
#FROM node:10-alpine

# set working directory
#WORKDIR /app

# add app
#COPY . /app

# install and cache app dependencies
#RUN npm install -g @angular/cli@8.2.0 --save-dev
#RUN npm install 
#RUN npm rebuild node-sass

# start app
#CMD ng serve --prod --host 0.0.0.0 --port 4200
#---------

# base image
FROM node:10-alpine as build

# set working directory
WORKDIR /app

# install and cache app dependencies
RUN npm install -g @angular/cli@8.2.0 --save-dev

# add app
COPY . /app


# generate build
RUN ng build --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine



# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html
#COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

# expose port 4201
EXPOSE 4201

# run nginx
CMD ["nginx", "-g", "daemon off;"]



