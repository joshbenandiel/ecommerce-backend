const router = require('express').Router()
const controller = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRole } = require('../features/auth');

router.get('/',isAuthenticatedUser,controller.getAllProducts);
router.post('/create', isAuthenticatedUser,authorizedRole('admin'),controller.createProduct);
router.put('/:id',isAuthenticatedUser,authorizedRole('admin'),controller.updateProducts)
router.delete('/:id',isAuthenticatedUser,authorizedRole('admin'),controller.deleteProduct)
router.get('/:id', controller.getAllProductDetails)

module.exports = router;
