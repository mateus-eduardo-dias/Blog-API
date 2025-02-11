# Blog API

![NPM Version](https://img.shields.io/npm/v/jsonwebtoken?style=for-the-badge&logo=jsonwebtokens&label=JWT&color=red)
![NPM Version](https://img.shields.io/npm/v/express?style=for-the-badge&logo=express&label=EXPRESS&color=red)

![GitHub Repo stars](https://img.shields.io/github/stars/mateus-eduardo-dias/Blog-API?style=for-the-badge&logo=github)
![GitHub watchers](https://img.shields.io/github/watchers/mateus-eduardo-dias/Blog-API?style=for-the-badge&logo=github)
![GitHub forks](https://img.shields.io/github/forks/mateus-eduardo-dias/Blog-API?style=for-the-badge&logo=github)
![GitHub License](https://img.shields.io/github/license/mateus-eduardo-dias/Blog-API?style=for-the-badge&logo=github&color=red)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Index

- [About this project](#About-this-project)
- [Instalation Guide](#Instalation-Guide)
  - [Prerequisites](#Prerequisites)
  - [Instalation](#Instalation)

## About this project

This is a API for Blogs made with [Node.js](https://nodejs.org/pt), it uses a [JWT](https://jwt.io/) Module to make authentication secure.

## Instalation Guide

### Prerequisites

For this project, you should have Node.js installed, which can be found [here](nodejs.org)
You may also need a database if you want to make your own API using this repository and host it

### Instalation

Firstly, you should copy the repository
```bash
git clone https://github.com/mateus-eduardo-dias/Blog-API.git
```
Then, install all packages
```bash
npm install
```
After all, you should create a `.env` file:
```env
DB_STR="Your database connection string goes here"
JWT_KEY="Your secret JWT Token goes here"
JWT_ISSUER="Your app name goes here"
JWT_EXP="Your Token duration in seconds (cant be null)"
```
**Note**: The JWT Token can be whatever you want, but make sure to not forget this code, since it will be used by JWT to make your Token

## Endpoints

There are some endpoints that can be used

|Endpoint|Description|
|--------|-----------|
|<kbd>POST /auth/register</kbd>|Register a user in a database|
|<kbd>POST /auth/login</kbd>|Enter a user from a database|
|<kbd>POST /blogs</kbd>|Creates a post|
|<kbd>GET /blogs</kbd>|Returns all posts from the database|

### POST /auth/register

**Description**:Register a user in a database
**BODY**:
```json
{
  "username": "<username goes here>",
  "password": "<password goes here>"
}
```
**RESPONSE**:
```json
{
  "status": true,
  "token": "<JWT Token>"
}
```
- **status**: Shows that the request worked, if this key do not appear, it probably mean there was a error
- **token**: Shows the JWT generated in that connection, it's recommended to store this information in a cookie or something like that

### POST /auth/login

**Description**:Enter a user from a database
**BODY**:
```json
{
  "username": "<username goes here>",
  "password": "<password goes here>"
}
```
**RESPONSE**:
```json
{
  "status": true,
  "token": "<JWT Token>"
}
```
- **status**: Shows that the request worked, if this key do not appear, it probably mean there was a error
- **token**: Shows the JWT generated in that connection, it's recommended to store this information in a cookie or something like that

**Note**: As you can see, `POST /auth/login` looks like `POST /auth/register`, but they have different purposes

- `POST /auth/register` creates a user to the database
- `POST /auth/login` joins a user that IS in the database, creating other token for the same user

### POST /blogs
**Description**: Creates a post
**BODY**:
```json
{
  "title": "<blogpage title goes here>",
  "content": "<blogpage content goes here>",
  "username": "<username goes here>"
}
```
**HEADERS**:
```json
{
  "Authorization": "Bearer <JWT Token>"
}
```
**RESPONSE**:
```json
  "status": true
```

### GET /blogs
**Description**: Returns all the posts in the database
**RESPONSE**:
```json
{
  "id":1,
  "title":"<title of the post>",
  "content":"<content of the post>",
  "comments": {
    ... (in development)
  },
  "stats": {
    ... (in development)
  },
  "username": "KilledPlayer77"
},
...other posts
```
**OPTIONAL HEADERS**
- `information_length`: Decides the maximum number of posts you want to get
- `page_number`: Decides the page number (it is affected by the `information_length` header
