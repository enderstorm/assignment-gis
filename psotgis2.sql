SELECT st_distance(st_transform(st_setsrid(st_makepoint(17.0399723,48.1033272999129), 4326), 3857), p.way), * 
FROM planet_osm_point p
WHERE amenity = 'pub' AND ST_DWithin(p.way, st_transform(st_setsrid(st_makepoint(17.0399723,48.1033272999129), 4326), 3857), 10000)


SELECT * 
FROM planet_osm_point p
WHERE amenity = 'pub' AND ST_DWithin(p.way::geography, ST_MAKEPOINT(17.10395003, 48.15951499)::geography, 5000)

SELECT ST_DISTANCE(ST_MAKEPOINT(48.15962971, 17.10379329)::geography, ST_MAKEPOINT(48.14754866, 17.10638507)::geography);

SELECT p.way
FROM planet_osm_point p
limit 10

SELECT ST_SETSRID(ST_MAKEPOINT(17.10395003, 48.15951499), 3857);

SELECT ST_MAKEPOINT(17.10395003, 48.15951499)::geography;
17.10395003, 48.15951499


SELECT st_distance(st_makepoint(17.10725784, 48.15171764)::geography, p.way::geography) as dist, * 
FROM planet_osm_point p
WHERE amenity = 'pub' AND ST_DWithin(p.way, st_makepoint(17.10725784, 48.15171764)::geography, 1000)
ORDER BY dist

SELECT DISTINCT(p.amenity) 
FROM planet_osm_point p


WITH puby AS (
	SELECT st_distance(st_makepoint(17.10725784, 48.15171764)::geography, p.way::geography) as dist, * 
	FROM planet_osm_point p
	WHERE amenity = 'pub' AND ST_DWithin(p.way, st_makepoint(17.10725784, 48.15171764)::geography, 1000)
	ORDER BY dist
)
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', json_agg(features.feature)
)
FROM (
	SELECT json_build_object(
	  'type', 'Feature',
	  'id', osm_id,
	  'geometry', ST_AsGeoJSON(st_transform(way, 4326))::json,
	  'properties', json_build_object(
	    'name', name,
	    'amenity', amenity
	  )
	) AS feature
	FROM puby) AS features