select carriers.name as n,
f1.flight_num as f1_num,
f1.origin_city as f1_origin_city,
f1.dest_city as f1_dest_city,
f1.actual_time as f1_actual_time,
f2.flight_num as f2_flight_num,
f2.origin_city as f2_origin_city,
f2.dest_city as f2_dest_city,
f2.actual_time as f2_actual_time,
f1.actual_time+f2.actual_time as total_time
from FLIGHTS f1, FLIGHTS f2, MONTHS, CARRIERS
where months.month = 0 and f1.month_id = months.mid and f2.month_id = months.mid and carriers.cid = f1.carrier_id
and f1.day_of_month = 15 and f2.day_of_month = 15 and f1.year = 2015 and f2.year = 2015 and f1.origin_city= 1 and f2.dest_city = 2 
and f1.dest_city = f2.origin_city and f1.carrier_id = f2.carrier_id and (f1.actual_time + f2.actual_time) < 420
