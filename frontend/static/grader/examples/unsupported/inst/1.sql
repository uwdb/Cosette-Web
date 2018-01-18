select distinct F.origin_city, F.dest_city, F.actual_time
from Flights F,
(select origin_city, max(actual_time) as max_time
from Flights
group by origin_city) X
where F.origin_city = X.origin_city
and F.actual_time = X.max_time;