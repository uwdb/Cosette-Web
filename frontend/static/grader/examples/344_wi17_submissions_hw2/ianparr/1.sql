SELECT fl.fid FROM Flights as fl
JOIN Carriers as cr, Weekdays as wd
WHERE fl.origin_city = 0
AND fl.dest_city = 1
AND cr.name = 2
AND wd.day_of_week = 3
GROUP BY fl.fid
HAVING fl.day_of_week_id = wd.did
AND fl.carrier_id = cr.cid