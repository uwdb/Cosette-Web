SELECT DISTINCT flight_num
FROM flights f, weekdays w, carriers c
WHERE f.day_of_week_id = w.did 
AND f.carrier_id = c.cid
AND origin_city = 0
AND dest_city = 1
AND day_of_week = 2
AND c.name = 3
