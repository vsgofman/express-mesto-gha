const User = require('../models/user');
// импортировать базу данных
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send(err));
// res.status(200).send('импортированные данные пользователей');

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Запрашиваемый пользователь не найден' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user));
};

const updateProfile = (req, res) => {
  const { userId } = req.params;
  User.findByIdAndUpdate(userId, req.body)
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(404).send({ message: 'Данные небыли обновлены' }));
};

// const updateAvatar = (req, res) => {

// };

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  // updateAvatar,
};
