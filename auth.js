let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js');

const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {

    const { user, pass } = req.body;
    const query = 'SELECT * FROM users WHERE name = $1 AND password = $2';
    const values = [user, pass];

    // issue query (returns promise)
    pool.query(query, values)
        .then (results => {
			// handle no match (login failed)
            if (results.rows.length === 0) {
                return res.status(401).json({
                    message: 'Login failed. Invalid username or password.',
                });
            }
            // handle the case if everything is ok
            resultUser = results.rows[0];
            
            const token = jwt.sign({username: resultUser.name, role: resultUser.type }, cfg.auth.jwt_key, { expiresIn: cfg.auth.expiration });

			res.status(200).json({
                user: user,
                role: resultUser.type,
                token: token
            });

        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).json({
            message: 'Internal server error during login.',
            });
        });

});

module.exports = router;