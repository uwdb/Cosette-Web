select P.origin_city, COALESCE(1.0* T.total_short / P.total,0)
from
	(select F2.origin_city, count(*) as total
	from Flights F2
	group by F2.origin_city) P
	
	left outer join
	(select F1.origin_city, count(*) as total_short
	from Flights F1
	where F1.actual_time < 180
	group by F1.origin_city) T

on T.origin_city = P.origin_city
order by 1.0* T.total_short / P.total;