select distinct flight_num from FLIGHTS, WEEKDAYS, CARRIERS where day_of_week = 0 AND name = 1 AND origin_city = 2 AND dest_city = 3 AND carrier_id = cid AND day_of_week_id = did
