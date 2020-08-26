const jwt = require('jsonwebtoken')
const User = require('./models/user.model')

const Authorization = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisis')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) { throw new Error('Terrible mistake')}
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = Authorization