const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const User = require('../models/user');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные при поиске пользователя');
      } next(err);
    }).catch(next);
};

// POST /signup
const register = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    })).then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    })).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при создании пользователя');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } next(err);
    })
    .catch(next);
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'jwt', { expiresIn: '7d' });
      res.status(200).send({ token: jwt });
    }).catch(() => {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }).catch(next);
};

// GET users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id пользователя');
      } next(err);
    }).catch(next);
};

// PATCH users/me
const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  ).then((user) => {
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id пользователя');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Передан некорректные данные при обновлении профиля');
      } next(err);
    }).catch(next);
};

// PATCH users/me/avatar
const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  ).then((user) => {
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id пользователя');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при обновлении аватара');
      } next(err);
    }).catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
