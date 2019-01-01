//──── ENTORNO ───────────────────────────────────────────────────────────────────────────
process.env.PORT = process.env.PORT || 3000
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//──── Vencimiento de token ──────────────────────────────────────────────────────────────
//      60 segundos, 60 minutos, 24 horas, 30 días
process.env.TOKEN_EXPIRE = 60 * 60 * 24 * 30

//──── SEED de autenticación ─────────────────────────────────────────────────────────────
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'DEV?SEED'

//──── BASE DE DATOS ─────────────────────────────────────────────────────────────────────
let urlDB

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
} else {
  urlDB = process.env.MONGO_URI
}

process.env.urlDB = urlDB
