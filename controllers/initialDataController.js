const bcrypt = require('bcrypt');
require('dotenv').config();

const Admin = require('../models/Admins');
const TypeEmployee = require('../models/TypeEmployee');
const Department = require('../models/Department');

const Logger = require('../common/logger');
const Message = require('../configs/message');

const initialDataController = {
    /*
     * Init admin account
     */
    initAdmin: async function (req, res) {
        try {
            // Get all admin account
            const getAll = await Admin.find({});
            // Check data has been initialized or not
            if (getAll.length > 0) {
                Logger('debug', 'Data has been initialized ');
                return res.status(400).json({
                    'message': 'Failure',
                    'data': '',
                    'code': Message['W-0013']
                });
            }

            // Init data
            // Init employee type
            const initTypeName = new TypeEmployee({
                typeName: process.env.HIGHEST_EMPLOYEE_TYPE_NAME
            });
            await initTypeName.save();
            Logger('debug', 'Initialized employee type successfully');

            // Init department
            const initDepartment = new Department({
                nameDepartment: process.env.INITIAL_NAME_DEPARTMENT,
                shortName: process.env.INITIAL_SHORT_NAME_DEPARTMENT
            });
            await initDepartment.save();
            Logger('debug', 'Initialized department successfully');

            // Init admin account
            const pwdHash = bcrypt.hashSync(process.env.INITIAL_PASSWORD_ADMIN, 10);
            const initAdmin = new Admin ({
                email: process.env.INITIAL_EMAIL_ADMIN,
                password: pwdHash,
                lastName: process.env.INITIAL_FIRST_NAME_ADMIN,
                firstName: process.env.INITIAL_LAST_NAME_ADMIN,
                age: 10,
                sex: 1,
                birthDay: "2/5/2000",
                dateIn: new Date(),
                department: initDepartment._id,
                typeEmployee: initTypeName._id,
                rank: process.env.INITIAL_RANK_ADMIN
            });
            await initAdmin.save();
            Logger('debug', 'Initialized admin successfully');
            return res.status(200).json({
                'message': 'Success',
                'data': {
                    'adminAccount': {
                        'email': initAdmin.email,
                        'password': process.env.INITIAL_PASSWORD_ADMIN
                    }
                },
                'code': Message['W-0014']
            })
        } catch (err) {
            Logger('error', 'Init admin account error');
            return res.status(500).json ({
                'message': 'Failure',
                'data': err.message,
                'code': Message['E-0001']
            });
        }
    }
}

module.exports = initialDataController;
