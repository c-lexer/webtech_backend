const express = require("express");
const router = express.Router();
const pool = require("./pool.js");

const checkAuth = require("./check_auth.js");

router.get("/", checkAuth, async (req, res) => {
  const query = `select
            bike_model_id,
            name,
            description ,
            wheel_size ,
            bike_category_id
        from
            bike_model bm ;`;
  const result = await pool.query(query);

  res.json(result.rows);
});

router.get("/:bike_model_id", checkAuth, async (req, res) => {
  const bike_model_id = req.params.bike_model_id;
  const query = `select
        bike_model_id,
        bm."name",
        description ,
        wheel_size ,
        bm.bike_category_id,
        bc.name as category_name
      from
        bike_model bm
      join bike_category bc on
        bm.bike_category_id = bc.bike_category_id WHERE bike_model_id = $1`;
  const result = await pool.query(query, [bike_model_id]);
  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

router.get("/:bike_model_id/reviews", checkAuth, async (req, res) => {
  const bike_model_id = req.params.bike_model_id;
  const query = `select
            r.rental_station_customer_review_id,
            r."content",
            r.rating,
            u."name"
          from
            public.bike_customer_review r
          join public.users u on
            r.user_id = u.user_id
          where
            r.bike_model_id = $1 ;`;
  const result = await pool.query(query, [bike_model_id]);
  if (result.rows.length > 0) {
    res.json(result.rows);
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

router.put("/", checkAuth, async (req, res) => {
  const { bike_model_id, name, description, wheel_size, bike_category_id } =
    req.body;
  const query = `UPDATE public.bike_model SET name = $1, description = $2, wheel_size = $3, bike_category_id = $4 WHERE bike_model_id = $5;`;
  const result = await pool.query(query, [
    name,
    description,
    wheel_size,
    bike_category_id,
    bike_model_id,
  ]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

router.delete("/:bike_model_id", checkAuth, async (req, res) => {
  const bike_model_id = req.params.bike_model_id;
  const query = "DELETE FROM public.bike_model WHERE bike_model_id = $1;";
  const result = await pool.query(query, [bike_model_id]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  const { name, description, wheel_size, bike_category_id } = req.body;
  const query =
    "INSERT INTO public.bike_model (name, description, wheel_size, bike_category_id) VALUES ($1, $2, $3, $4);";
  const result = await pool.query(query, [
    name,
    description,
    wheel_size,
    bike_category_id,
  ]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Error" });
  }
});

router.get("/:bike_model_id/features", checkAuth, async (req, res) => {
  const bike_model_id = req.params.bike_model_id;
  const query = `select
      bf.bike_feature_id,
      bike_model_id,
      name
    from
      bike_feature_to_model bftm
    join bike_feature bf on
      bftm.bike_feature_id = bf.bike_feature_id where
      bftm.bike_model_id = $1 ;`;
  const result = await pool.query(query, [bike_model_id]);
  if (result.rows.length > 0) {
    res.json(result.rows);
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

router.delete(
  "/:bike_model_id/feature/:bike_feature_id",
  checkAuth,
  async (req, res) => {
    const bike_model_id = req.params.bike_model_id;
    const bike_feature_id = req.params.bike_feature_id;
    const query =
      "DELETE FROM public.bike_feature_to_model WHERE bike_model_id = $1 AND bike_feature_id = $2";
    const result = await pool.query(query, [bike_model_id, bike_feature_id]);
    if (result.rowCount > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Model not found" });
    }
  }
);

router.post("/:bike_model_id/feature/", checkAuth, async (req, res) => {
  var { name } = req.body;
  const bike_model_id = req.params.bike_model_id;
  const query = "SELECT * from public.bike_feature WHERE name = $1";
  var result = await pool.query(query, [name]);
  if (result.rowCount === 0) {
    const query2 =
      "INSERT INTO public.bike_feature (name) VALUES ($1) RETURNING *";
    const result2 = await pool.query(query2, [name]);
    const query3 =
      "INSERT INTO public.bike_feature_to_model (bike_model_id, bike_feature_id) VALUES ($1, $2) RETURNING *";
    const result3 = await pool.query(query3, [
      bike_model_id,
      result2.rows[0].bike_feature_id,
    ]);
    res
      .status(200)
      .json({ bike_feature_id: result2.rows[0].bike_feature_id, name: name });
  } else {
    const query2 =
      "INSERT INTO public.bike_feature_to_model (bike_model_id, bike_feature_id) VALUES ($1, $2) RETURNING *";
    const result2 = await pool.query(query2, [
      bike_model_id,
      result.rows[0].bike_feature_id,
    ]);
    res
      .status(200)
      .json({ bike_feature_id: result2.rows[0].bike_feature_id, name: name });
  }
});

module.exports = router;
