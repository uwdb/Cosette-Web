SELECT name, fir.fid, fir.origin_city, fir.dest_city, fir.actual_time,
       sec.fid, sec.origin_city, sec.dest_city, sec.actual_time, sec.actual_time + fir.actual_time as TotalTime
FROM Flights as fir, Months as fir_m, Flights as sec, Months as sec_m, Carriers
WHERE fir.origin_city = 0
AND sec.dest_city = 1
AND fir_m.month = 2
AND sec_m.month = 2
AND fir.year = 2015
AND sec.year = 2015
AND fir.day_of_month = 15
AND sec.day_of_month = 15
AND fir.dest_city = sec.origin_city
AND fir.actual_time + sec.actual_time < 420
AND fir.carrier_id = sec.carrier_id
GROUP BY fir.fid, sec.fid