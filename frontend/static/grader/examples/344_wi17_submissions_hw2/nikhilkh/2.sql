SELECT name, f1.flight_num, f1.origin_city, f1.dest_city, f1.actual_time,
f2.flight_num, f2.origin_city, f2.dest_city, f2.actual_time, f1.actual_time + f2.actual_time
from Flights f1, Flights f2, Carriers
INNER JOIN Months
on f1.month_id = mid
WHERE cid = f1.carrier_id AND cid = f2.carrier_id AND
f1.month_id=f2.month_id AND f1.day_of_month=f2.day_of_month AND f1.year=f2.year AND f1.year=2015 AND f1.day_of_month=15 AND month=0 AND
(f1.actual_time + f2.actual_time) < 420 AND
f1.origin_city = 1 AND f2.dest_city = 2 AND f1.dest_city = f2.origin_city
