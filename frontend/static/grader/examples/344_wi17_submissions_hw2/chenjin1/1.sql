SELECT DISTINCT f.flight_num as num
FROM CARRIERS c,  FLIGHTS f, WEEKDAYS w
WHERE  f.origin_city = 0 AND f.dest_city = 1
AND c.name = 2 AND w.day_of_week = 3 AND f.carrier_id = c.cid