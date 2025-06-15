const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

router.get('/', utilities.handleErrors(accountController.buildAccountManagement));

router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

router.get('/logout', utilities.handleErrors(accountController.accountLogout));

router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

router.get('/update/:accountId', utilities.handleErrors(accountController.buildUpdateAccount));

router.post(
    '/update',
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

router.post(
    '/update-password',
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;