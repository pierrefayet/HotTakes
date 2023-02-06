const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  usersLiked: [{ type: String }],
  usersDisliked: [{ type: String }]
});
//ajout un champs dans mon objet json
sauceSchema.virtual('likes').get(function() {
  return this.usersLiked.length;
});
//ajout un champs dans mon objet json
sauceSchema.virtual('dislikes').get(function() {
  return this.usersDisliked.length;
});

//serialize l'ajout des champs like et dislike qui sont précalculés car ajout d'un champs non compris
//dans le models d'origine se qui empêche de trouver le champs like et dislike dans le processus de serialisation par defaut
sauceSchema.methods.toJSON = function() {
  const sauceObject = this.toObject();
  sauceObject.likes = this.likes;
  sauceObject.dislikes = this.dislikes;
  return sauceObject;
};

module.exports = mongoose.model('Sauce', sauceSchema);
