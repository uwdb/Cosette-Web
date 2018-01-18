SELECT  c.name, f1.flight_num, f1.origin_city, f1.dest_city, 
        f1.actual_time, f2.flight_num, f2.origin_city, f2.dest_city, f2.actual_time,
        f1.actual_time + f2.actual_time AS total_flight_time
FROM flights AS f1, flights AS f2, months AS m, carriers AS c
WHERE
    f1.origin_city = 0 AND
    f2.dest_city = 1 AND
    f1.dest_city = f2.origin_city AND
    f1.carrier_id = f2.carrier_id AND
    f1.carrier_id = c.cid AND
    f1.day_of_month = f2.day_of_month AND
    f1.day_of_month = 15 AND
    f1.month_id = f2.month_id AND
    f1.month_id = m.mid AND
    m.month = 2 AND
    f1.year = f2.year AND
    f1.year = 2015 AND
    total_flight_time < 420