SELECT c1.name AS carrier_name, 
   f1.flight_num AS flight_num_first,
   f1.origin_city AS origin_city_first,
   f1.dest_city AS dest_city_first,
   f1.actual_time AS flight_time_first, 

   f2.flight_num AS flight_num_second,
   f2.origin_city AS origin_city_second,
   f2.dest_city AS dest_city_second,
   f2.actual_time AS flight_time_second,

   f1.actual_time + f2.actual_time AS total_flight_time
FROM Flights f1, Carriers c1,
Flights f2,
Months m
WHERE origin_city_first = 0 AND
dest_city_second = 1 AND
dest_city_first = origin_city_second AND
f1.year = 2015 AND
f2.year = 2015 AND
f1.month_id = m.mid AND
f2.month_id = m.mid AND
m.month = 2 AND
f1.day_of_month = 15 AND
f2.day_of_month = 15 AND
f1.carrier_id = f2.carrier_id AND
f1.carrier_id = c1.cid AND
total_flight_time < (7 * 60)