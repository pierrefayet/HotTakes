let passwordValidator = require('password-validator');
let passwordSchema = new passwordValidator();

passwordSchema
.is().min(5)
.is().max(100)
.has().uppercase()
.has().lowercase(1)
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = (req, res, next) => {
  if(passwordSchema.validate(req.body.password)) {
    next();

  }else{
    return res.status(400).json({ error :"le mot de passe doit contenir au moins deux chiffres et une majuscule, sans espace:" + passwordSchema.validate('req.body.password', { list: true })})
  }
}
