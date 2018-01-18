 select carriers.name, f1.fid, f1.origin_city, f1.dest_city, 
        f1.actual_time, f2.fid, f2.origin_city, f2.dest_city,
        f2.actual_time, (f1.actual_time + f2.actual_time) as total_flight_time
 from carriers, flights f1, flights f2, months
 where carriers.cid = f1.carrier_id
 and carriers.cid = f2.carrier_id
 and f1.carrier_id = f2.carrier_id
 and months.mid = f1.month_id
 and months.mid = f2.month_id
 and f1.dest_city = f2.origin_city
 and f1.origin_city = 0
 and f2.dest_city = 1
 and months.month = 2
 and f1.day_of_month = 15
 and f2.day_of_month = 15
 and f1.year = 2015
 and f2.year = 2015
 and ((f1.actual_time + f2.actual_time) / 60.0) < 7.0