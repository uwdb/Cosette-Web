-- From Grace Qiu, hw3
SELECT DISTINCT f1.origin_city
FROM flights f1
WHERE NOT EXISTS (SELECT f2.origin_city
					FROM flights f2
				   WHERE f1.origin_city = f2.origin_city 
				     AND f2.actual_time >= 180)
ORDER BY f1.origin_city;