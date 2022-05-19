const express = require('express');
const fs = require('fs');
const MockObject = require("../models/MockObject.js");

const router = express.Router();

makeResponse = (mockObject, req, res, next) => {
  if (mockObject.useAuth() && !req.headers.authorization) {
    const error = new Error();
    error.status = 401;
    error.statusText = 'Unauthorized';

    next(error);
  }

  if (mockObject.hasErrorOfResponse()) {
    const error = new Error();
    error.status = mockObject.getStatusOfResponse() || 500;
    error.statusText = mockObject.getStatusTextOfResponse() || '';
    error.message = mockObject.getErrorMessageOfResponse();
    error.name = mockObject.getErrorNameOfResponse();

    next(error);
  }

  res.status(mockObject.getStatusOfResponse());

  if (mockObject.hasDataOfResponse()) {
    res.send(mockObject.getDataOfResponse());
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
        const mockObject = new MockObject(data);

        switch (method) {
          case "get":
            router.get(mockObject.requestUrl, (req, res, next) => {
              makeResponse(mockObject, req, res, next);
            });
            break;
          case "post":
            router.post(mockObject.requestUrl, (req, res, next) => {
              makeResponse(mockObject, req, res, next);
            });
            break;
          case "put":
            router.put(mockObject.requestUrl, (req, res, next) => {
              makeResponse(mockObject, req, res, next);
            });
            break;
          case "delete":
            router.delete(mockObject.requestUrl, (req, res, next) => {
              makeResponse(mockObject, req, res, next);
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
