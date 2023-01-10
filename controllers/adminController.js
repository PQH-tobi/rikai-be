const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require('../models/Admins');
const TypeEmployee = require('../models/TypeEmployee');
const Logger = require('../common/logger');
const Message = require('../configs/message');
const { stringDateToISOString } = require('../common/dateFormat');

const adminController = {
    /*
     * Create new admin account
     */
    createAdmin: async function (req, res) {
        try {
            const { email, password, lastName, firstName, age, address, sex,
                    identificationNumber, birthDay, dateIn, dateOut, department,
                    typeEmployee, rank } = req.body;

            // Check existing email
            Logger('debug', 'Checking existing email:' + email);
            const checkEmail = await Admin.findOne({ email });
            Logger('debug', 'Checking existing email response: ' + checkEmail);
            if (checkEmail) {
                return res.status(400).json({
                    'message': 'Success',
                    'data': '',
                    'code': Message['W-0001']
                });
            }

            // Hash password
            const pwdHash = bcrypt.hashSync(password, 10);

            // Add new admin account
            const addAdmin = new Admin({
                email: email,
                password: pwdHash,
                lastName: lastName,
                firstName: firstName,
                age: age,
                address: address,
                sex: sex,
                identificationNumber: identificationNumber,
                birthDay: birthDay,
                dateIn: dateIn,
                dateOut: dateOut,
                department: department,
                typeEmployee: typeEmployee,
                rank: rank
            });
            await addAdmin.save();
            Logger('debug', 'Added admin: ' + addAdmin);

            res.status(200).json({
                'message': 'Success',
                'data': '',
                'code': Message['W-0002']
            });
        } catch (err) {
            Logger('error', 'Add new admin error');
            return res.status(500).json({
                'message': 'Failure',
                'data': err.message,
                'code': Message['E-0001']
            });
        }
    },

    /*
     * Login administrator
     */
    loginAdmin: async function (req, res) {
        try {
            const { email, password } = req.body;

            Logger('debug', 'Login admin with data: ' + { email, password });

            // Search with email
            const findAdminAccount = await Admin.findOne({ email });
            if (!findAdminAccount) {
                Logger('debug', 'Email does not exist');
                return res.status(400).json(
                    {
                        'message': 'Success',
                        'data': '',
                        'code': Message['W-0003']
                    }
                );
            }

            const checkPassword = bcrypt.compareSync(password, findAdminAccount.password, (err, result) => {
                if (err) {
                    Logger('error', 'Check compare password failed');
                    return res.status(400).json(
                        {
                            'message': 'Failure',
                            'data': '',
                            'code': Message['W-0001']
                        }
                    );
                }

                return result;
            });
            if (!checkPassword) {
                Logger('debug', 'Invalid password');
                return res.status(400).json(
                    {
                        'message': 'Success',
                        'data': '',
                        'code': Message['W-0004']
                    }
                )
            }

            // Create access token and refresh token
            const accessToken = createAccessToken(
                {
                    id: findAdminAccount._id,
                    type: 'ADMIN'
                }
            );

            const refreshToken = createRefreshToken(
                {
                    id: findAdminAccount._id,
                    type: 'ADMIN'
                }
            );

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: 'user/refresh_token'
            });

            Logger('debug', 'Admin account ID: ' + findAdminAccount._id.toString() + ' log in success');

            return res.status(200).json({
                'message': 'Success',
                'data': {
                    'accessToken': accessToken,
                    'adminInformation': {
                        'id': findAdminAccount._id.toString(),
                        'email': findAdminAccount.email,
                        'rank': findAdminAccount.rank,
                        'typeEmployee': findAdminAccount.typeEmployee,
                        'firstName': findAdminAccount.firstName,
                        'lastName': findAdminAccount.lastName
                    }
                },
                'code': ''
            });
        } catch (err) {
            Logger('error', 'Login administrator error');
            return res.status(500).json(
                {
                    'message': 'Failure',
                    'data': err.message,
                    'code': Message['E-0001']
                }
            );
        }
    },

    /*
     * Update admin account information
     */
    updateAdmin: async function (req, res) {
        try {
            const { id, email, firstName, lastName, age, address, sex, identificationNumber,
                birthDay, dateIn, department, typeEmployee, rank, idUpdate } = req.body;

            // Check existing account
            const checkAdmin = await Admin.findOne({ _id: id });
            if (!checkAdmin) {
                Logger('debug', 'Account ID: ' + id + ' not found');
                return res.status(400).json({
                    'message': 'Failure',
                    'data': '',
                    'code': Message['W-0016']
                });
            }
            console.log(checkAdmin)

            if (idUpdate !== id) {
                // Highest level

                // Get data update account
                const getUpdateId = await Admin.findOne({ _id: idUpdate });
                if (!getUpdateId) {
                    Logger('debug', 'Account update ID: ' + idUpdate + ' not found');
                    return res.status(400).json({
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0016']
                    });
                }

                // Check account update is owner
                const checkOwner = await TypeEmployee.findOne({ _id: checkOwner.typeEmployee });
                if (!checkOwner) {
                    Logger('debug', 'Type employee ID: ' + checkOwner.typeEmployee + ' not found');
                    return res.status(400).json({
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0008']
                    });
                }

                // Check TypeEmployee
                if (checkOwner.typeName !== process.env.HIGHEST_EMPLOYEE_TYPE_NAME) {
                    Logger('debug', 'Just owner can change account');
                    return res.status(400).json({
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0018']
                    });
                }

                // Just have only 1 owner
                if (typeEmployee === checkOwner.typeEmployee.toString()) {
                    Logger('debug', 'Can not set type employee: owner');
                    return res.status(400).json({
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0020']
                    });
                }
            } else {
                // Change for yourself

                // Check not input
                if (birthDay === '' || dateIn === '') {
                    Logger('debug', 'Require birthDay and dateIn field');
                    return res.status(400).json({
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0017']
                    });
                }

                // Check admin is owner
                if (checkAdmin.typeEmployee === 1) {
                    return true;
                }
            }


            const updateData = { email, firstName, lastName, age, address, sex,
                                identificationNumber, birthDay: stringDateToISOString(birthDay),
                                dateIn: stringDateToISOString(dateIn), department, typeEmployee, rank };

            console.log('Original data', checkAdmin)
            console.log('Update data: ', updateData);

            // Check change value
            // let isUpdated = false;
            // for (const [key, value] of Object.entries(updateData)) {
            //      if (key === 'birthDay' || key === 'dateIn') {
            //          if () {
            //              
            //          }
            //          else if (updateData[key] !== stringDateToISOString(checkAdmin[key].toString())) {
            //              isUpdated = true;
            //          }
            //      }
            //     else (updateData[key] !== checkAdmin[key]) {
            //         isUpdated = true;
            //     }
            // }

            // // Not update data
            // if (!isUpdated) {
            //     Logger('debug', 'No changes found')
            //     return res.status(400).json({
            //         'message': 'Success',
            //         'data': '',
            //         'code': Message['W-0009']
            //     });
            // }


        } catch (err) {
            Logger('error', 'Update information for admin account error');
            return res.status(500).json({
                'message': 'Failure',
                'data': err.message,
                'code': Message['E-0001']
            });
        }
    }
}

const createAccessToken = (id) => {
    return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TOKEN_ADMIN });
}

const createRefreshToken = (id) => {
    return jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TOKEN_ADMIN });
}

module.exports = adminController;
