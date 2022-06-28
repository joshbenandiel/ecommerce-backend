const router = require('express').Router()
const userController = require('../controllers/userContoller')
const { isAuthenticatedUser, authorizedRole } = require('../features/auth')


router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/logout', userController.logoutUser)
router.post('/password/reset', userController.forgotPassword)
router.put('/password/reset/:token', userController.resetPassword)
router.get('/me',isAuthenticatedUser,userController.getUserDetail)
router.put('/password/update', isAuthenticatedUser,userController.updateUserPassword)
router.put('/me/update', isAuthenticatedUser,userController.updateUserProfile)
router.get('/admin/users', isAuthenticatedUser,authorizedRole('admin'),userController.getAllUser);
router.get('/admin/users/:id', isAuthenticatedUser,authorizedRole('admin'),userController.getUser);
router.put('/admin/users/:id', isAuthenticatedUser,authorizedRole('admin'),userController.updateUserRole);
router.delete('/admin/users/:id', isAuthenticatedUser,authorizedRole('admin'),userController.deleteUser);

module.exports = router;