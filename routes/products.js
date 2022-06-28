const router = require('express').Router()
const controller = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRole } = require('../features/auth');


router.get('/',controller.getAllProducts);
router.post('/create', isAuthenticatedUser,authorizedRole('admin'),controller.createProduct);
router.put('/review',isAuthenticatedUser,controller.createProductReview)
router.get('/reviews',controller.getAllProductReviews)
router.delete('/reviews',isAuthenticatedUser,controller.deleteReview)
router.delete('/:id',isAuthenticatedUser,authorizedRole('admin'),controller.deleteProduct)
router.get('/:id', controller.getAllProductDetails)
router.put('/:id',isAuthenticatedUser,authorizedRole('admin'),controller.updateProducts)




module.exports = router;
