const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка.' }));

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

// POST /signup
const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    })).then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'jwt', { expiresIn: '7d' });
      res.status(200).send(token);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(401).send({ message: 'Ошибка аутентификации.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  ).then((user) => {
    res.status(200).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  ).then((user) => {
    res.status(200).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
