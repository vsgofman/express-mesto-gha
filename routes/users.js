const router = require('express').Router();

router.get('/users', (req, res) => {
  console.log(req, res);
  // возвращает всех пользователей
});

router.get('/users/:userId', (req, res) => {
  res.send(req.params);
  // возвращает пользователя по id
});

router.post('/users', (req, res) => {
  console.log(req, res);
  // создает пользователя
});

module.exports = router;
