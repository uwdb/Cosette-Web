SELECT DISTINCT flight_num
FROM flights, carriers, weekdays
WHERE 
    origin_city = 0 AND
    dest_city = 1 AND
    cid = carrier_id AND
    name = 2 AND
    day_of_week_id = did AND
    day_of_week = 3