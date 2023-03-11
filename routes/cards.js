const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
// 400 — Переданы некорректные данные при создании карточки.
// 500 — Ошибка по умолчанию.
router.delete('/:cardId', deleteCardById);
// 404 — Карточка с указанным _id не найдена.
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);
// 400 — Переданы некорректные данные для постановки/снятии лайка.
// 404 — Передан несуществующий _id карточки.
// 500 — Ошибка по умолчанию.

module.exports = router;
