SELECT DISTINCT f1.origin_city, f1.dest_city, f1.actual_time
FROM flights f1
WHERE f1.actual_time = (SELECT MAX(f2.actual_time)
						  FROM flights f2
						 WHERE f1.origin_city = f2.origin_city)