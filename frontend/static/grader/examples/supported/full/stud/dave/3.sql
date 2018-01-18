SELECT DISTINCT C.name AS name
  FROM FLIGHTS AS F
  JOIN CARRIERS AS C
    ON F.carrier_id=C.cid
  JOIN WEEKDAYS AS W
    ON F.day_of_week_id=W.did
 GROUP BY C.name,F.year,F.month_id,F.day_of_month 
HAVING Count(*)>1000
