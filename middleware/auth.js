const jwt = require('jsonwebtoken');

const Message = require('../configs/message');
const Logger = require('../common/logger');

const auth = (req, res, next) => {
    try {
        const tokenId = req.header('Authorization');

        if (!tokenId) {
            Logger('error', 'Invalid authorization token');
            return res.status(400).json(
                {
                    'message': 'Failure',
                    'data': '',
                    'code': Message['E-0002']
                }
            );
        }

        jwt.verify(tokenId, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                Logger('error', 'Invalid token');
                return res.status(400).json(
                    {
                        'message': 'Failure',
                        'data': '',
                        'code': Message['E-0003']
                    }
                );
            }
            req.user = user;
            next();
        });
    } catch (err) {
        Logger('error', 'Authentication error');
        return res.status(500).json(
            {
                'message': 'Failure',
                'data': err.message,
                'code': Message['E-0001']
            }
        );
    }
}

module.exports = auth;
