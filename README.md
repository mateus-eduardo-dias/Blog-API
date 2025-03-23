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
  - [Error Handling](#error-handling)
    - [Unknown Errors](#unknown-errors)

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

## Error Handling
Here's a sheet for all errors you may be facing:
|Code|Description|Status Code|Cause|
|----|-----------|---------|-----|
|A0|Password is incorrect|401|User was found but password is incorrect|
|A1|Authorization not required (fixed)|400|A Body was expected in the request, but token was recieved|
|A2|Auth Type is wrong (signin - fixed)|400|A body was expected in the request, but nothing was recieved|
|A3|Auth Type is wrong (signup - fixed)|400|A body was expected in the request, but nothing was recieved|
|A4|Auth Type invalid|401|Could not found a body when trying to sign up/in (replaced A1, A2 and A3)|
|A5|Auth Type invalid|401|JWT tokens use Bearer to authenticate, other method was recieved|
|A6|No authentication recieved|401|Request did not include authorization header|
|A7|Token invalid - Pattern is not expected|401|Token has invalid payload values|
|A7B|Token invalid - Pattern is not expected|401|Token has a different number of values|
|A8|Token invalid - No type detected|401|Token "type" payload has different/no value|
|A9|Token expired|401|As the name says, token has expired (you should get a new one)|
|A10|Token invalid|401|Token is invalid (there are many reasons for that, check https://www.npmjs.com/package/jsonwebtoken#jsonwebtokenerror)|
|NF0|User not found|404|Could not found a user when trying to sign in|
|I0|User exists|409|User already exists (sign up error)|

### Unknown errors
They should not happen, if you see it, report to me at mateuseduqueiroz@proton.me

|Code|HTTP Code|Cause|
|----|---------|-----|
|U0|500|Signup error (database did not return the user created)|
|U1|400|Token validation error|
