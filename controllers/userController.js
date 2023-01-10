const User = require('../models/User');
const Message = require('../configs/message');
const e = require('express');

const userController = {
  async get(req, res, next) {
    await User.find({})
      .then((user) => {
        const configUser = user.map(item => ({
          _id: item?._id,
          nameProduct: item?.nameProduct,
          qualityProduct: item?.qualityProduct,
          dateProduct: item?.dateProduct,
          priceProduct: item?.priceProduct,
          typeProduct: item?.typeProduct,
          deleteType: item?.deleteType,
        }))
        res.status(200).json({
          'message': 'Success',
          'data': configUser,
          'code': Message['W-0002'],
        });
      })
      .catch(next);
  },
  async create(req, res) {
    try {
      const { body } = req;
      const data = { body };
      const user = new User(data);
      await user
        .save()
        .then((err, data) => {
          if (err) {
           return res.status(400).json(
              {
                  'message': 'Failure',
                  'data': '',
                  'code': Message['R-0002']
              });
          }
          else{
            return  res.status(200).json({
              statusCode: 200,
              message: "Create data product successfully",
              data: data,
              success: true,
            })
          }
        })
    }
    catch (err) {
      res.status(500).json({
        'message': 'Failure',
        'data': '',
        'code': Message['E-0004']
      })
    };
  },

}

module.exports = userController;