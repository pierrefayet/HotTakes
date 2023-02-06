const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        message: 'Sauce non trouvé !'
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non authorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non authorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        })
      };
    })
    .catch(error => {
      res.status(400).json({ error: 'Sauce non supprimé !' });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: 'Sauce non trouvé !'
      });
    }
  );
};

exports.likesAndDislikes = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

Sauce.findOne({ _id: sauceId })
  .then((sauce) => {
    console.log(sauce)
      if (like == 1 && !sauce.usersLiked.includes(userId)) {
        //on recupere l'id de la sauce on met l'userId dans le tableau et on l'incremente de 1
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId } })
          .then(() => res.status(200).json({ message: 'Like ajouté !' }))
          .catch((error) => res.status(400).json({ error }));
      }
      //2 si oui et que c'est le l'utilisateur qui like on decremente
      if (like == -1 && !sauce.usersDisliked.includes(userId)) {
        //on recupere l'id de la sauce on met l'userId dans le tableau et on l'incremente de 1
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId } })
          .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch((error) => res.status(400).json({ error }));
      }


      //3 si l'utlisateur like ou dislike et a deja liker on empeche le like
      if (like == 0) {
        //on verifie si l'utilisateur est present dans le tableau usersLiked et on decremente son like pour l'annuler
            if (sauce.usersLiked.includes(userId)) {
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId } })
                .then(() => res.status(200).json({ message: 'Mise a jour du like éffectué !!' }))
                .catch((error) => res.status(400).json({ error :'Mise a jour du like échoué !' }));
            }

            //on verifie si l'utilisateur est present dans le tableau usersDisLiked et on decremente son like pour l'annuler
            if (sauce.usersDisliked.includes(userId)) {
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId } })
                .then(() => res.status(200).json({ message: 'Mise a jour du dislike éffectué !' }))
                .catch((error) => res.status(400).json({ error: 'Mise a jour dislike échoué!' }));
            }
          }
        })

  if (like !== 0 && like !== 1 && like !== -1) {
    res.status(400).json({message: 'La valeur de like doit être 0, 1 ou -1'});
  }
}



