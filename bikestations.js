const express = require("express");
const router = express.Router();
const pool = require("./pool.js");

const checkAuth = require("./check_auth.js");

router.get("/", checkAuth, async (req, res) => {
  const query = "SELECT * FROM rental_stations";
  const result = await pool.query(query);

  res.json(result.rows);
});

router.get("/:station_id", checkAuth, async (req, res) => {
  const station_id = req.params.station_id;
  const query = "SELECT * FROM rental_stations WHERE rental_station_id = $1";
  const result = await pool.query(query, [station_id]);

  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

router.put("/", checkAuth, async (req, res) => {
  const { rental_station_id, name, address, locationx, locationy } = req.body;
  const query =
    "UPDATE public.rental_stations SET name = $1, address = $2, locationX = $3, locationY = $4 WHERE rental_station_id = $5;";
  const result = await pool.query(query, [
    name,
    address,
    locationx,
    locationy,
    rental_station_id,
  ]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

router.delete("/:station_id", checkAuth, async (req, res) => {
  const station_id = req.params.station_id;
  const query =
    "DELETE FROM public.rental_stations WHERE rental_station_id = $1;";
  const result = await pool.query(query, [station_id]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  const { rental_station_id, name, address, locationx, locationy } = req.body;
  const query =
    "INSERT INTO public.rental_stations (name, address, locationX, locationY) VALUES ($1, $2, $3, $4);";
  const result = await pool.query(query, [name, address, locationx, locationy]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Error" });
  }
});

router.get("/:station_id/parkingplaces", checkAuth, async (req, res) => {
  const station_id = req.params.station_id;
  const query = `select
                  pp.*,
                  bc."name"
                from
                  parking_place pp
                join bike_category bc on
                  pp.bike_category_id = bc.bike_category_id
                        where
                            rental_station_id = $1`;
  const result = await pool.query(query, [station_id]);
  if (result.rows.length > 0) {
    res.json(result.rows);
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

router.post("/:station_id/parkingplaces", checkAuth, async (req, res) => {
  const bike_category_id = req.body.bike_category_id;
  const station_id = req.params.station_id;
  const query =
    "INSERT INTO public.parking_place (rental_station_id, bike_category_id) VALUES ($1, $2) RETURNING *;";
  const result = await pool.query(query, [station_id, bike_category_id]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Error" });
  }
});

router.delete(
  "/:station_id/parkingplace/:parking_place_id",
  checkAuth,
  async (req, res) => {
    const parking_place_id = req.params.parking_place_id;
    const query =
      "DELETE FROM public.parking_place WHERE parking_place_id = $1;";
    const result = await pool.query(query, [parking_place_id]);
    if (result.rowCount > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Error on deletion." });
    }
  }
);

router.get("/:station_id/reviews", checkAuth, async (req, res) => {
  const station_id = req.params.station_id;
  const query = `select
          r.rental_station_customer_review_id,
          r."content",
          r.rating,
          u."name"
        from
          public.rental_station_customer_review r
        join public.users u on
          r.user_id = u.user_id
        where
          r.rental_station_id = $1 ;`;
  const result = await pool.query(query, [station_id]);
  if (result.rows.length > 0) {
    res.json(result.rows);
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

router.get("/:station_id/capacity", checkAuth, async (req, res) => {
  const station_id = req.params.station_id;
  const query = `select
	count(*) capacity,
	(
	select
		count(*)
	from
		bike
	join parking_place pp on
		bike.parking_place_id = pp.parking_place_id
	join bike_model bm on
		bike.bike_model_id = bm.bike_model_id
	where
		bm.bike_category_id = bc.bike_category_id
		and pp.rental_station_id = $1) taken,
	bc."name" as type
from
	parking_place pp
join bike_category bc on
	pp.bike_category_id = bc.bike_category_id
where
	rental_station_id = $1
group by
	bc.bike_category_id;`;
  const result = await pool.query(query, [station_id]);
  if (result.rows.length > 0) {
    res.json(result.rows);
  } else {
    res.status(404).json({ error: "Station not found" });
  }
});

module.exports = router;
