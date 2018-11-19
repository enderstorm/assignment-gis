select * from planet_osm_line
where name = 'Twin City Liner'

SELECT * FROM planet_osm_line l 
 CROSS JOIN planet_osm_polygon p
 WHERE p.name = 'Karlova Ves'

 WITH leisure AS (
  SELECT * FROM planet_osm_polygon p
  WHERE leisure IS NOT NULL
)
SELECT SUM(st_area(way)) FROM leisure

WITH leisure AS (
  SELECT * FROM planet_osm_polygon p
  WHERE leisure IS NOT NULL
)
SELECT * FROM leisure

WITH parky AS (
  SELECT * FROM planet_osm_polygon p
  WHERE leisure = 'park'
)
SELECT osm_id, name, ST_AsGeoJSON(way) as geojson FROM parky

WITH puby AS (
	SELECT * FROM planet_osm_point p
	WHERE amenity = 'pub'
)
SELECT osm_id, name, amenity, ST_AsGeoJSON(way)::json as geojson FROM puby

SELECT * FROM planet_osm_point



WITH puby AS (
	SELECT * FROM planet_osm_point p
	WHERE amenity = 'pub'
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

'SRID=4326;POINT(48.13963,17.10455)'

SELECT st_distance(st_transform(st_setsrid(st_makepoint(17.0399723,48.1033272999129), 4326), 3857), p.way), * 
FROM planet_osm_point p
WHERE amenity = 'pub' AND ST_DWithin(p.way, st_transform(st_setsrid(st_makepoint(17.0399723,48.1033272999129), 4326), 3857), 10000)

select ST_MakePoint(48.13963,17.10455) from planet_osm_point

select ST_TRANSFORM(ST_SetSRID(ST_MakePoint(48.13963,17.10455), 4326), 3857) from planet_osm_point

--"{"type":"Point","coordinates":[1896881.03956749,6124062.06298688]}"
--[17.0399723,48.1033272999129]
--id: 436905344
--"{"type":"Point","coordinates":[1893504.60809224,6129415.82469239]}"
--[17.0096413,48.1354336999052]
--id: 2231322972

SELECT ST_Distance(
  -- st_transform(ST_GeomFromText('SRID=4326;POINT(48.13963 17.10455)'), 3857), -- Los Angeles (LAX)
  st_transform(st_setsrid(st_makepoint(17.0399723,48.1033272999129), 4326), 3857),
  ST_GeomFromText('POINT(1893504.60809224 6129415.82469239)', 3857)     -- Paris (CDG)
  );

SELECT ST_Distance(
  ST_GeomFromText('POINT(17.0399723 48.1033272999129)', 4326), -- Los Angeles (LAX)
  ST_GeomFromText('POINT(17.0096413 48.1354336999052)', 4326)     -- Paris (CDG)
  );

WITH rails AS (
  select * from planet_osm_roads as r
  where r.railway = 'rail'
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
      'name', name
    )
  ) as feature
FROM rails) AS features
