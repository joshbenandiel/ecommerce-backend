const router = require('express').Router()
const userController = require('../controllers/userContoller')


router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/logout', userController.logoutUser)
router.post('/password/reset', userController.forgotPassword)
router.put('/password/reset/:token', userController.resetPassword)

module.exports = router;