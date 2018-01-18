select c.name, f.flight_num, f.origin_city, f.dest_city, f.actual_time, 
f2.flight_num, f2.origin_city, f2.dest_city, f2.actual_time, 
(f2.actual_time + f.actual_time) as total
from Flights as f, Flights as f2, Carriers as c, Months as m
where m.month = 0
and f.year = 2015 
and f2.year = 2015
and m.mid = f.month_id
and m.mid = f2.month_id
and f2.day_of_month = 15
and f.day_of_month = 15
and f.origin_city = 1
and f.dest_city = f2.origin_city
and f2.dest_city = 2
and f.carrier_id = f2.carrier_id
and f.carrier_id = c.cid
and total < 420 --420 minutes = 7 hours