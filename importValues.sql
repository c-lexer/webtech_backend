\connect webtech23project


INSERT INTO public.users(name, password, type, email, wallet)
VALUES
  ('Frodo', 'Baggins', 'customer', 'a@e.a',  15)
, ('Sam', 'Gamgee', 'customer', 'a@e.a',10)
, ('Merry', 'Brandybuck', 'customer', 'a@e.a',2)
, ('Pippin', 'Took', 'customer', 'a@e.a',3)
, ('Gandalf', 'TheGray', 'customer',  'a@e.a',100)
, ('Boromir', 'FavouriteSon', 'customer','a@e.a', 0)
, ('Aragorn', 'Elessar', 'customer', 'a@e.a',50)
, ('Gimli', 'Gloinsson', 'customer', 'a@e.a',20)
, ('admin', 'admin', 'admin', 'a@e.a',1000)
;

INSERT INTO public.bike_category(name)
VALUES 
  ('City')
, ('Kids')
, ('Mountain')
, ('Cargo')
, ('Electric')
;
INSERT INTO public.rental_stations(name, address, locationX, locationY)
VALUES 
  ('Klagenfurt University', 'Universitätsstraße 65/67, 9020 Klagenfurt am Wörthersee', 46.61636565712125, 14.266278142450135)
, ('Klagenfurt Train Station', 'Walther-von-der-Vogelweide-Platz 1, 9020 Klagenfurt am Wörthersee', 46.61615446216898, 14.313526904369791)
;

INSERT INTO public.parking_place(rental_station_id, bike_category_id)
VALUES 
  (1,1)
, (1,1)
, (1,2)
, (1,2)
, (1,3)
, (1,4)
, (2,1)
, (2,2)
, (2,3)
, (2,3)
, (2,4)
, (2,4)
;

INSERT INTO public.rental_station_customer_review(user_id, content, rating, rental_station_id)
VALUES 
  (1, 'Good Bike rental station!', '5', 1)
, (2, 'Bad! Got stabbed by Witch King', '1', 1)
, (3, 'Meh.', '4', 2)
, (4, 'YOU SHALL NOT PASS', '3', 2)
;


INSERT INTO public.bike_model(name, description, wheel_size, bike_category_id)
VALUES 
  ('Cityrider', 'Just an ordinary bike to get around in the city.', 26, 1)
, ('Urbanizer', 'Just an ordinary bike to get around in the city.', 26, 1)
, ('Vroom', 'Just an ordinary kids bike.', 12, 2)
, ('TinyRide', 'Just an ordinary kids bike.', 12, 2)
, ('Bergsteiger', 'Just an ordinary bike to get around in the mountains.', 29, 3)
, ('LoadHauler', 'Just an ordinary cargo bike.', 26, 4)
, ('Zappy', 'Just an ordinary electric bike.', 26, 5)
;


INSERT INTO public.bike_feature(name)
VALUES 
  ('Bell')
, ('Reflector')
, ('Disc Breaks')
, ('Full Suspension')
, ('Rear Rack')
;

INSERT INTO public.bike_feature_to_model(bike_feature_id, bike_model_id)
VALUES 
  (1, 1)
, (1, 2)
, (1, 3)
, (1, 4)
, (1, 6)
, (1, 7)
, (2, 2)
, (2, 3)
, (2, 4)
, (2, 6)
, (2, 7)
, (3, 2)
, (3, 5)
, (3, 6)
, (4, 5)
, (5, 1)
, (5, 6)
, (5, 7)
;

INSERT INTO public.bike_customer_review(user_id, content, rating, bike_model_id)
VALUES 
  (1, 'Good Bike!', '5', 1)
, (2, 'Bad!', '1', 1)
, (3, 'Bad!', '1', 2)
, (4, 'Meh.', '4', 3)
, (5, 'YOU SHALL NOT PASS', '3', 4)
, (6, '*dies*', '3', 5)
, (7, '*kicks helmet', '3', 6)
, (8, 'That still only counts as one!', '3', 7)
;

INSERT INTO public.bike(bike_model_id, parking_place_id)
VALUES 
  (1, 1)
, (2, 6)
, (3, 2)
, (4, 3)
, (5, 7)
, (6, 5)
, (6, 9)
, (7, 4)
, (7, 8)
;

INSERT INTO public.booking(user_id, bike_id, bike_feature_id, bike_category_id, booking_begin, booking_end)
VALUES
  (1, 1, NULL, NULL, TIMESTAMP '2024-01-19 10:23:54', TIMESTAMP '2024-01-19 11:23:54')
, (2, NULL, 1, NULL, TIMESTAMP '2024-01-19 10:23:54', TIMESTAMP '2024-01-19 11:23:54')
, (3, NULL, NULL, 1, TIMESTAMP '2024-01-19 10:23:54', TIMESTAMP '2024-01-19 11:23:54')
;
