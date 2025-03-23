**Note**: This project is in development, this API is not complete yet

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

- [Blog API](#blog-api)
  - [Index](#index)
  - [About this project](#about-this-project)
  - [Instalation Guide](#instalation-guide)
    - [Prerequisites](#prerequisites)
    - [Instalation](#instalation)
  - [Endpoints](#endpoints)
    - [POST /api/v1/auth/signup](#post-apiv1authsignup)
    - [GET /api/v1/auth/signin](#get-apiv1authsignin)

## About this project

This is a API for Blogs made with [Node.js](https://nodejs.org/pt), it uses a [JWT](https://jwt.io/) Module to make authentication secure.

## Instalation Guide

### Prerequisites

For this project, you should have Node.js installed, which can be found [here](nodejs.org)
You may also need a postgres database if you want to make your own API using this repository and host it

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
PG_CONNSTR="Your database connection string goes here"
JWT_KEY="Your secret JWT Private key goes here"
```
**Note**: The JWT Token can be whatever you want, but make sure to not forget this code, since it will be used by JWT to make your Token

## Endpoints

There are some endpoints that can be used

|Endpoint|Description|
|--------|-----------|
|<kbd>POST /api/v1/auth/signup</kbd>|Sign up|
|<kbd>GET /api/v1/auth/signin</kbd>|Sign in|

### POST /api/v1/auth/signup

**Description**:Register a user in a database (aka sign up) and get his token (aka sign in)
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
  "token": "<JWT Token>"
}
```
- **token**: Shows the JWT generated for the connection, this code is valid for 1 day

### GET /api/v1/auth/signin

**Description**:Get a token for the user (aka sign in)
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
  "token": "<JWT Token>"
}
```
- **token**: Shows the JWT generated for the connection, this code is valid for 1 day