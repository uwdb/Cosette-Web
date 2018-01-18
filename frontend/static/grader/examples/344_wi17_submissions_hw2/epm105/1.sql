 select distinct flight_num
 from carriers, weekdays, flights
 where flights.carrier_id = carriers.cid
 and flights.day_of_week_id = weekdays.did
 and flights.origin_city = 0
 and flights.dest_city = 1
 and weekdays.day_of_week = 2
 and carriers.name = 3