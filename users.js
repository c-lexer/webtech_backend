const express = require("express");
const router = express.Router();
const pool = require("./pool.js");

const checkAuth = require("./check_auth.js");

router.delete("/:user_name", checkAuth, async (req, res) => {
  if (req.params.user_name === req.userData.username) {
    const query = `DELETE FROM public.users WHERE name = '${req.params.user_name}';`;
    console.log(query);
    const result = await pool.query(query);
    if (result.rowCount > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(500).json({ error: "Error" });
  }
});

router.get("/:user_name", checkAuth, async (req, res) => {
  const query = `select user_id, name,email,wallet
      from
      users        WHERE name = '${req.params.user_name}'`;
  const result = await pool.query(query);
  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.put("/", checkAuth, async (req, res) => {
  if (req.body.name === req.userData.username) {
    const query = `UPDATE public.users SET wallet = ${req.body.wallet} WHERE user_id = ${req.body.user_id} RETURNING *;`;
    const result = await pool.query(query);
    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Error" });
    }
  } else {
    res.status(500).json({ error: "Error" });
  }
});

module.exports = router;
