const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { validateUrl } = require('../utils/validateUrl');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: { validator: validator.isEmail, message: 'Введите корректный email' },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
      validate: { validator: validateUrl, message: 'Введите валидную ссылку' },
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }) // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password);
    });
};

module.exports = mongoose.model('user', userSchema);
