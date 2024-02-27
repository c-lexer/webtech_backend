\connect webtech23project

----------------- Begin helpers ------------------
CREATE TYPE public.stars AS ENUM ('1', '2', '3', '4', '5');
ALTER TYPE public.stars OWNER TO postgres;

CREATE TYPE public.user_type AS ENUM ('admin', 'customer');
ALTER TYPE public.user_type OWNER TO postgres;

CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    password character varying(200) NOT NULL,
    type user_type DEFAULT 'customer'
);
ALTER TABLE public.users OWNER TO postgres;

----------------- Begin rental stations tables & views ------------------


CREATE TABLE public.rental_stations (
    rental_station_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    address character varying(200) NOT NULL,
    locationX float NOT NULL,
    locationY float NOT NULL
);
ALTER TABLE public.rental_stations OWNER TO postgres;

CREATE TABLE public.bike_category (
    bike_category_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL
);
ALTER TABLE public.bike_category OWNER TO postgres;

CREATE TABLE public.parking_place (
    parking_place_id SERIAL PRIMARY KEY,
    rental_station_id integer REFERENCES public.rental_stations (rental_station_id) ON DELETE CASCADE NOT NULL,
    bike_category_id integer REFERENCES public.bike_category (bike_category_id) ON DELETE CASCADE NOT NULL
);
ALTER TABLE public.parking_place OWNER TO postgres;

CREATE TABLE public.rental_station_customer_review (
    rental_station_customer_review_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES public.users(user_id)  ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    rating public.stars NOT NULL,
    rental_station_id integer REFERENCES public.rental_stations (rental_station_id) ON DELETE CASCADE 
);
ALTER TABLE public.rental_station_customer_review OWNER TO postgres;

----------------- Begin bike tables & views ------------------

CREATE TABLE public.bike_model (
    bike_model_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    wheel_size int NOT NULL, -- in inches    
    bike_category_id integer REFERENCES public.bike_category (bike_category_id)  ON DELETE CASCADE NOT NULL
);
ALTER TABLE public.bike_model OWNER TO postgres;

CREATE TABLE public.bike_feature (
    bike_feature_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL
);
ALTER TABLE public.bike_feature OWNER TO postgres;

CREATE TABLE public.bike_feature_to_model (
    bike_feature_id integer REFERENCES public.bike_feature (bike_feature_id)  ON DELETE CASCADE NOT NULL,    
    bike_model_id integer REFERENCES public.bike_model (bike_model_id)  ON DELETE CASCADE NOT NULL
);
ALTER TABLE public.bike_feature_to_model OWNER TO postgres;

CREATE TABLE public.bike (
    bike_id SERIAL PRIMARY KEY,
    bike_model_id integer REFERENCES public.bike_model (bike_model_id)  ON DELETE CASCADE NOT NULL,
    parking_place_id integer REFERENCES public.parking_place (parking_place_id)  ON DELETE SET NULL
);
ALTER TABLE public.bike OWNER TO postgres;

CREATE TABLE public.bike_customer_review (
    rental_station_customer_review_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES public.users(user_id)  ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    rating public.stars NOT NULL,
    bike_model_id integer REFERENCES public.bike_model (bike_model_id) ON DELETE CASCADE 
);
ALTER TABLE public.rental_station_customer_review OWNER TO postgres;

----------------- Begin feature tables & views ------------------
CREATE TABLE public.booking (
    booking_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES public.users(user_id)  ON DELETE CASCADE NOT NULL,
    bike_id integer REFERENCES public.bike (bike_id) ON DELETE CASCADE ,
    bike_feature_id integer REFERENCES public.bike_feature (bike_feature_id) ON DELETE CASCADE ,    
    bike_category_id integer REFERENCES public.bike_category (bike_category_id) ON DELETE CASCADE ,
    booking_begin timestamp DEFAULT CURRENT_TIMESTAMP,
    booking_end timestamp NOT NULL
);
ALTER TABLE public.booking OWNER TO postgres;

CREATE TABLE public.wallet (
    wallet_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES public.users(user_id)  ON DELETE CASCADE NOT NULL,
    amount money NOT NULL DEFAULT 0
);
ALTER TABLE public.wallet OWNER TO postgres;