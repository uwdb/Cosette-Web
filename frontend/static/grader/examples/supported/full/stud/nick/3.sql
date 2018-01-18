SELECT DISTINCT c.name
FROM Flights f, Carriers c
WHERE f.carrier_id = c.cid
GROUP BY c.name, f.day_of_month
HAVING count(*) > 1000
