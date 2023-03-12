const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  if (name === undefined && about === undefined && avatar === undefined) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }
  return User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateAvatar = (req, res) => {
  if (req.body.avatar === undefined) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
  }
  return User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
