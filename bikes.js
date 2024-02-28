const express = require("express");
const router = express.Router();
const pool = require("./pool.js");

const checkAuth = require("./check_auth.js");

router.get("/", checkAuth, async (req, res) => {
  const query = `select
                    bike.*,
                    bm.name as bike_model_name,
                    rs.rental_station_id as rental_station_id,
                    bc.name as bike_category_name,
                    bc.bike_category_id
                  from
                    bike
                  join bike_model bm on
                    bike.bike_model_id = bm.bike_model_id
                    full join parking_place pp on pp.parking_place_id = bike.parking_place_id
                    full join rental_stations rs on rs.rental_station_id = pp.rental_station_id 
                    join bike_category bc on bc.bike_category_id = bm.bike_category_id`;
  const result = await pool.query(query);

  res.json(result.rows);
});

router.get("/:bike_id", checkAuth, async (req, res) => {
  const query = `select
                    bike.*,
                    bm.name as bike_model_name,
                    rs.rental_station_id as rental_station_id,
                    bc.name as bike_category_name,
                    bc.bike_category_id
                  from
                    bike
                  join bike_model bm on
                    bike.bike_model_id = bm.bike_model_id
                    full join parking_place pp on pp.parking_place_id = bike.parking_place_id
                    full join rental_stations rs on rs.rental_station_id = pp.rental_station_id 
                    join bike_category bc on bc.bike_category_id = bm.bike_category_id where bike_id = ${req.params.bike_id}`;
  const result = await pool.query(query);

  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json({ error: "Bike not found" });
  }
});

router.delete("/:bike_id", checkAuth, async (req, res) => {
  const bike_id = req.params.bike_id;
  const query = "DELETE FROM public.bike WHERE bike_id = $1;";
  const result = await pool.query(query, [bike_id]);
  if (result.rowCount > 0) {
    res.status(204).json();
  } else {
    res.status(404).json({ error: "Bike not found" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  const get_capacity_query = `select
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
    and pp.rental_station_id = ${req.body.rental_station_id}) taken,
  bc."name" as type
  from
  parking_place pp
  join bike_category bc on
  pp.bike_category_id = bc.bike_category_id
  where
  rental_station_id = ${req.body.rental_station_id} AND bc.bike_category_id ='${req.body.bike_category_id}'
  group by
  bc.bike_category_id;`;

  const capacity_result = await pool.query(get_capacity_query);
  console.log(capacity_result.rows[0]);
  if (capacity_result.rows[0].capacity <= capacity_result.rows[0].taken) {
    console.log("No capacity");
    res.status(500).json({ error: "No capacity" });
  } else {
    const { bike_model_id } = req.body;
    const query = `INSERT INTO public.bike (bike_model_id, parking_place_id) VALUES ($1, (select 
        parking_place_id
      from
        parking_place pp
      full join rental_stations rs on
        rs.rental_station_id = pp.rental_station_id
      where
        bike_category_id = ${req.body.bike_category_id}
        and rs.rental_station_id = ${req.body.rental_station_id}
        and not exists (
        select
          *
        from
          bike
        where
          parking_place_id = pp.parking_place_id ) limit 1)) RETURNING *;`;
    const result = await pool.query(query, [bike_model_id]);
    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Error" });
    }
  }
});

router.put("/", checkAuth, async (req, res) => {
  const get_capacity_query = `select
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
    and pp.rental_station_id = ${req.body.rental_station_id}) taken,
  bc."name" as type
  from
  parking_place pp
  join bike_category bc on
  pp.bike_category_id = bc.bike_category_id
  where
  rental_station_id = ${req.body.rental_station_id} AND bc.bike_category_id ='${req.body.bike_category_id}'
  group by
  bc.bike_category_id;`;
  console.log(get_capacity_query);
  const capacity_result = await pool.query(get_capacity_query);
  console.log(capacity_result.rows[0]);
  if (capacity_result.rows[0].capacity <= capacity_result.rows[0].taken) {
    console.log("No capacity");
    res.status(500).json({ error: "No capacity" });
  } else {
    const query = `UPDATE public.bike SET bike_model_id = ${req.body.bike_model_id}, parking_place_id = (select 
    parking_place_id
  from
    parking_place pp
  full join rental_stations rs on
    rs.rental_station_id = pp.rental_station_id
  where
    bike_category_id = ${req.body.bike_category_id}
    and rs.rental_station_id = ${req.body.rental_station_id}
    and not exists (
    select
      *
    from
      bike
    where
      parking_place_id = pp.parking_place_id ) limit 1) WHERE bike_id = ${req.body.bike_id};`;
    const result = await pool.query(query);
    if (result.rowCount > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Model not found" });
    }
  }
});

module.exports = router;
