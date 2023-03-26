function validateUrl(url) {
  const RegExp = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  if (RegExp.test(url)) {
    return url;
  }
  throw new Error();
}

module.exports = { validateUrl };
