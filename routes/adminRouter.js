const router = require('express').Router();

const initDataController = require('../controllers/initialDataController');
const adminController = require('../controllers/adminController');
const typeEmployeeController = require('../controllers/typeEmployeeController');

const auth = require('../middleware/auth');
const productController = require('../controllers/userController');

// AdminController
router.post('/create', auth, adminController.createAdmin);
router.post('/login', adminController.loginAdmin);
router.put('/account/update', auth, adminController.updateAdmin);

// TypeEmployeeController
router.post('/typeEmployee/create', auth, typeEmployeeController.createTypeEmployee);
router.route('/typeEmployee/update').put(auth, typeEmployeeController.updateTypeEmployee);
router.route('/typeEmployee/delete').post(auth, typeEmployeeController.deleteTypeEmployee);

// Product \
router.post('/user/create', productController.create);
router.get('/user/create', productController.get);

// Init data
router.get('/init', initDataController.initAdmin)

module.exports = router;
