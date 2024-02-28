let cfg = require("./config.json");
const express = require("express");
const router = express.Router();

const pool = require("./pool.js");

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { user, pass } = req.body;
  const query = "SELECT * FROM users WHERE name = $1 AND password = $2";
  const values = [user, pass];

  // issue query (returns promise)
  pool
    .query(query, values)
    .then((results) => {
      // handle no match (login failed)
      if (results.rows.length === 0) {
        return res.status(401).json({
          message: "Login failed. Invalid username or password.",
        });
      }
      // handle the case if everything is ok
      resultUser = results.rows[0];

      const token = jwt.sign(
        { username: resultUser.name, role: resultUser.type },
        cfg.auth.jwt_key,
        { expiresIn: cfg.auth.expiration }
      );

      res.status(200).json({
        user: user,
        role: resultUser.type,
        token: token,
      });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).json({
        message: "Internal server error during login.",
      });
    });
});

router.post("/register", (req, res) => {
  const { user, email, pass } = req.body;
  const query = `INSERT INTO public.users(name, password, type, email, wallet)
                VALUES ('${user}', '${pass}', 'customer', '${email}', 0) RETURNING *;`;
  // issue query (returns promise)
  pool
    .query(query)
    .then((results) => {
      // handle no match (register failed)
      if (results.rows.length === 0) {
        return res.status(401).json({
          message: "Registration failed.",
        });
      }
      res.status(200).json({
        user: user,
        role: results.rows[0].type,
      });
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      res.status(500).json({
        message: "Internal server error during registration.",
      });
    });
});

module.exports = router;
