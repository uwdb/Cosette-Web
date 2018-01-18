select distinct c.name as name
from CARRIERS as c join FLIGHTS as f 
on c.cid = f.carrier_id
group by c.cid, c.name, f.year, f.month_id, f.day_of_month
having count(*) > 1000
