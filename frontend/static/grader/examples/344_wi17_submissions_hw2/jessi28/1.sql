SELECT DISTINCT flight_num 
FROM flights f, carriers c, weekdays w 
WHERE f.origin_city = 0 
    AND f.dest_city = 1 
    AND c.name = 2 
    AND  w.day_of_week = 3 
    AND  f.carrier_id = c.cid 
    AND  f.day_of_week_id = w.did