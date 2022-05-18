const express = require('express');
const fs = require('fs');

const router = express.Router();

makeResponse = (data, req, res, next) => {
  if (data.header && data.header.useAuth && !req.headers.authorization) {
    const error = new Error();
    error.status = 401;
    error.statusText = 'Unauthorized';

    next(error);
  }

  if (data.response.error) {
    const error = new Error();
    error.status = data.response.status || 500;
    error.statusText = data.response.statusText || '';
    error.message = data.response.error.message;
    error.name = data.response.error.name;

    next(error);
  }

  if (data.response.status) {
    res.status(data.response.status);
  } else {
    res.status(200);
  }


  if (Object.keys(data.response.data).length > 0) {
    res.send(data.response.data);
  }
}

makeRouter = (baseDir) => {
  const methods = ['get', 'post', 'put', 'delete'];

  methods.forEach((method) => {
    try {
      const data = fs.readFileSync(`${baseDir}/${method}.json`, 'utf8');
      if (!data) {
        return
      }

      const jsonData = JSON.parse(data);

      jsonData.forEach((data) => {

        switch (method) {
          case "get":
            router.get(data.requestUrl, (req, res, next) => {
              makeResponse(data, req, res, next);
            });
            break;
          case "post":
            router.post(data.requestUrl, (req, res, next) => {
              makeResponse(data, req, res, next);
            });
            break;
          case "put":
            router.put(data.requestUrl, (req, res, next) => {
              makeResponse(data, req, res, next);
            });
            break;
          case "delete":
            router.delete(data.requestUrl, (req, res, next) => {
              makeResponse(data, req, res, next);
            });
            break;
        }
      })
    } catch(err) {
      console.error(err);
    }
  })

  return router;
}

module.exports = makeRouter;
