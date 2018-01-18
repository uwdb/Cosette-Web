SELECT DISTINCT f.flight_num
  FROM flights AS f, carriers AS c, weekdays AS w
 WHERE f.carrier_id = c.cid
   AND f.day_of_week_id = w.did
   AND c.name = 0
   AND f.origin_city = 1
   AND f.dest_city = 2
   AND w.day_of_week = 3