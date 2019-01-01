const jwt = require('jsonwebtoken')

/*----------  VERIFICAR TOKEN  ----------*/
const verifyToken = (req, res, next) => {
  let token = req.get('Authorization')

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      return res.status(400).json({ ok: false, err: { message: 'Token No Valido' } })
    }
    req.user = decoded.user
    next()
  })
}

/*----------  VERIFICAR ADMINISTRADOR  ----------*/
const verifyAdminUser = (req, res, next) => {
  const { role } = req.user

  return role === 'ADMIN_ROLE' ? next() : res.status(403).json({ ok: false, err: { message: 'Sin Permisos' } })
}



module.exports = { verifyToken, verifyAdminUser }
