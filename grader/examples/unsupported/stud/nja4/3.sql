-- From Grace Qiu, hw3
SELECT DISTINCT f1.origin_city, ((SELECT COUNT(*)
									FROM flights f2
								   WHERE f1.origin_city = f2.origin_city AND f2.actual_time < 180) * 100.0) / COUNT(*) AS perc
FROM flights f1
GROUP BY f1.origin_city
ORDER BY perc;