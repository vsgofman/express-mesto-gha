const mongoose = require('mongoose');
const { validateUrl } = require('../utils/validateUrl');

const userSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model('user', userSchema);
