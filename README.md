E-Library API Server
==========================

[Note: This repository is still in incubation stage]

This is the api server that powers the e-library project created

by the "League Of Extra Ordinary Computer Science Students" (LEOCSS) FUTMINNA.

Installation
================

1. Go over to [NodeJS Official Website](http://nodejs.org) and grab yourself a copy of NodeJS. Follow their guide

for installation on the platform you wish to deploy.

2. Launch your terminal and `cd` into wherever this directory is on your computer then run the commands below.

```bash
$ npm install
$ npm start
```

Setup
=============

Open up your Rest-Client tool or You can use curl on the terminal and try to access these endpoints

GET /books?access_token=[ACCESS_TOKEN]

You should see the following result.

```json
{
    "id": "53153513",
    "name": "NodeJS for Dummies",
    ....
}
```

Credits
==================

Laju Morrison [Primary maintainer of this repository]

If you want to add your name here, CONTRIBUTE...

Enjoy!!