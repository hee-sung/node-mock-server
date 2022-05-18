const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors({
  credentials: true
}));

const userRouter = require('./src/routes/users/users');
app.use('/', userRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  res.locals.message = err.message || error.statusText;
  res.locals.error = err;
  res.status(err.status);
  res.send({ message: err.message || error.statusText});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})