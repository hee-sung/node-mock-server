const express = require('express');
const fs = require('fs');

const router = express.Router();

checkAuth = (data, req, next) => {
  if (data.header && data.header.useAuth && !req.headers.authorization) {
    const error = new Error();
    error.status = 401;
    error.statusText = 'Unauthorized';

    next(error);
  }
}

checkError = (data, next) => {
  if (data.response.error) {
    const error = new Error();
    error.status = data.response.status;
    error.statusText = data.response.statusText;
    error.message = data.response.error.message;
    error.name = data.response.error.name;

    next(error);
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
        if ('get' === method) {
          router.get(data.requestUrl, (req, res, next) => {
            checkAuth(data, req, next);
            checkError(data, next);

            res.status(data.response.status);
            res.send(data.response.data);
          })
        } else if ('post' === method) {
          router.post(data.requestUrl, (req, res, next) => {
            checkAuth(data, req, next);
            checkError(data, next);

            res.status(data.response.status);

            if (Object.keys(data.response.data).length > 0) {
              res.send(data.response.data);
            }

          });
        } else if ('put' === method) {
          router.put(data.requestUrl, (req, res, next) => {
            checkAuth(data, req, next);
            checkError(data, next);

            res.status(data.response.status);
            res.send(data.response.data);
          })
        } else if ('delete' === method) {
          router.delete(data.requestUrl, (req, res, next) => {
            checkAuth(data, req, next);
            checkError(data, next);

            res.status(data.response.status);
          });

        }

      })
    } catch(err) {
      console.error(err);
    }
  })

  return router;
}

module.exports = makeRouter;
