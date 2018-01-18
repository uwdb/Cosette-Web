SELECT DISTINCT flight_num FROM Flights, Carriers, Weekdays
WHERE carrier_id = cid AND day_of_week_id = did
AND origin_city = 0 AND dest_city = 1 AND day_of_week=2 AND name=3
