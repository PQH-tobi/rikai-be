const TypeEmployee = require('../models/TypeEmployee');

const Logger = require('../common/logger');
const Message = require('../configs/message');

require('dotenv').config();

const typeEmployeeController = {
    /*
     * Create a new type employee
     */
    createTypeEmployee: async function (req, res) {
        try {
            const { typeName, thisType } = req.body;

            // Check is owner
            if (thisType !== process.env.HIGHEST_EMPLOYEE_TYPE_NAME) {
                Logger('debug', 'Just owner can create employee type');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0006']
                    }
                );
            }

            // Check typeName
            const checkTypeName = await TypeEmployee.findOne({ typeName, deleteType: '00' });
            if (checkTypeName) {
                Logger('debug', 'Type name employee already exists');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0005']
                    }
                );
            }

            // Add new type name
            const addTypeName = new TypeEmployee({
                typeName
            });

            await addTypeName.save();
            Logger('debug', 'Create ' + typeName + ' successfully');
            return res.status(200).json(
                {
                    'message': 'Success',
                    'data': '',
                    'code': Message['W-0007']
                }
            );

        } catch (err) {
            Logger('error', 'Create type employee error');
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
     * Update type employee
     */
    updateTypeEmployee: async function (req, res) {
        try {
            const { typeName, thisType } = req.body;

            // Check is owner
            if (thisType !== process.env.HIGHEST_EMPLOYEE_TYPE_NAME) {
                Logger('debug', 'Just owner can create employee type');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0006']
                    }
                );
            }

            // Get type employee information
            const typeEmployee = await TypeEmployee.findOne({ _id: req.params.id });
            if (!typeEmployee) {
                Logger('debug', 'Not found employee type');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0008']
                    }
                );
            }

            if (typeEmployee.typeName === process.env.HIGHEST_EMPLOYEE_TYPE_NAME) {
                Logger('debug', 'Can not change highest employee');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0011']
                    }
                )
            }

            // Check change data
            if (typeName === typeEmployee.typeName) {
                Logger('debug', 'No changes found');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0009']
                    }
                );
            }

            // Check name existing on database
            const checkName = await TypeEmployee.find({ typeName, deleteType: '00' });
            if (checkName.length !== 0) {
                if (checkName[0]._id.toString() !== req.params.id) {
                    Logger('debug', 'Employee type name already exists');
                    return res.status(400).json(
                        {
                            'message': 'Failure',
                            'data': '',
                            'code': Message['W-0005']
                        }
                    );
                }
            }

            // Update employee type name
            await TypeEmployee.findByIdAndUpdate({ _id: req.params.id }, {
                typeName
            });

            Logger('debug', 'Update employee type name success');
            return res.status(200).json(
                {
                    'message': 'Success',
                    'data': '',
                    'code': Message['W-0010']
                }
            );
        } catch (err) {
            Logger('error', 'Update type employee error');
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
     * Delete employee type name
     */
    deleteTypeEmployee: async function (req, res) {
        try {
            const { id } = req.body;

            // Search ID Type Employee
            const getEmployeeType = await TypeEmployee.findOne({ _id: id, deleteType: '00' });
            if (!getEmployeeType) {
                Logger('debug', 'No employee type found');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['W-0008']
                    }
                );
            }

            // Can not delete highest employee type
            if (getEmployeeType.typeName === process.env.HIGHEST_EMPLOYEE_TYPE_NAME) {
                Logger('debug', 'Can not delete highest employee type');
                return res.status(400).json({
                    'message': 'Failure',
                    'data': '',
                    'code': Message['W-0015']
                });
            }

            // Delete employee type
            await TypeEmployee.findByIdAndUpdate({ _id: id }, {
                deleteType: '01'
            });

            Logger('debug', 'Delete employee type ID: ' + id + ' success');
            return res.status(200).json(
                {
                    'message': 'Success',
                    'data': '',
                    'code': Message['W-0012']
                }
            );
        } catch (err) {
            Logger('error', 'Delete type employee error');
            return res.status(500).json(
                {
                    'message': 'Failure',
                    'data': err.message,
                    'code': Message['E-0001']
                }
            );
        }
    }
}

module.exports = typeEmployeeController;
