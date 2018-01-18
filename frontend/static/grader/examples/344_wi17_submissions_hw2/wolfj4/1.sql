select distinct flight_num
from Flights, Carriers, Weekdays
where origin_city = 0 and dest_city 
= 1 and carrier_id = cid and name = 2
and day_of_week_id = did and day_of_week = 3