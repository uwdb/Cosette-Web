select distinct F1.origin_city
from Flights F1
where not exists(	select * from Flights F2
					where F2.actual_time >= 180
					and F2.origin_city = F1.origin_city )
order by F1.origin_city;