select distinct Flights.flight_num as id0
from Flights, Carriers, Weekdays
where Carriers.name = 0
and Carriers.cid = Flights.carrier_id
and Weekdays.day_of_week = 1
and Weekdays.did = Flights.day_of_week_id
and Flights.origin_city = 2
and Flights.dest_city = 3