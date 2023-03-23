const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка.' }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteCardById = (req, res) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (card.owner !== req.user._id) {
        return res.status(403).send({ message: 'Вы можете удалить только свою карточку' });
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена.' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
          }
          return res.status(500).send({ message: 'На сервере произошла ошибка.' });
        });
    });
};

const addLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (card === null) {
    return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
  }
  return res.status(200).send(card);
}).catch((err) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка.' });
});

const deleteLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (card === null) {
    return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
  }
  return res.status(200).send(card);
}).catch((err) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка.' });
});

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
