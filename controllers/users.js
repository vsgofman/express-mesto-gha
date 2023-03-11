const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send(err));

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => res.status(200).send(user))
    .catch((err) => console.log(err));
  // .catch(() => res.status(404).send({ message: 'Данные небыли обновлены' }));
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(404).send({ message: 'Аватар небыл обновлен' }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
