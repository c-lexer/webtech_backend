const express = require("express");
const router = express.Router();
const pool = require("./pool.js");

const checkAuth = require("./check_auth.js");

router.get("/", checkAuth, async (req, res) => {
  const query = `select * from bike_category;`;
  const result = await pool.query(query);

  res.json(result.rows);
});

router.delete("/:bike_category_id", checkAuth, async (req, res) => {
  const bike_category_id = req.params.bike_category_id;
  const query = "DELETE FROM public.bike_category WHERE bike_category_id = $1;";
  const result = await pool.query(query, [bike_category_id]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  const { name } = req.body;
  const query =
    "INSERT INTO public.bike_category (name) VALUES ($1) RETURNING *;";
  const result = await pool.query(query, [name]);
  console.log(result.rows[0]);
  if (result.rowCount > 0) {
    res.status(200).json(result.rows[0]);
  } else {
    res.status(404).json({ error: "Error" });
  }
});

module.exports = router;
