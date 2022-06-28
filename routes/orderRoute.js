const router = require('express').Router()
const orderController = require('../controllers/orderController')
const { isAuthenticatedUser, authorizedRole } = require('../features/auth')


router.post('/new',isAuthenticatedUser, orderController.createOrder)
router.get('/me',isAuthenticatedUser,orderController.myOrders)
router.get('/:id',isAuthenticatedUser,orderController.getSingleOrder)
router.get('/admin/orders',isAuthenticatedUser,authorizedRole("admin"),orderController.getAllOrders)
router.put('/admin/orders/:id',isAuthenticatedUser,authorizedRole("admin"),orderController.updateOrder)
router.delete('/admin/orders/:id',isAuthenticatedUser,authorizedRole("admin"),orderController.deleteOrder)



module.exports = router;