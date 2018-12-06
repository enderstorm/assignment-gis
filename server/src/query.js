export const queryTime = async db => {
  try {
    const result = await db.query('SELECT NOW() as now');
    return result.rows[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const queryExample = async db => {
  try {
    const query = `
    WITH parky AS (
      SELECT * FROM planet_osm_polygon p
      WHERE leisure = 'park'
    )
    SELECT osm_id, name, ST_AsGeoJSON(way) as geojson FROM parky
    `;
    const result = await db.query(query);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const puby = async db => {
  try {
    const sql = `
    WITH puby AS (
      SELECT * FROM planet_osm_point p
      WHERE amenity = 'cafe'
    )
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(features.feature)
    )
    FROM (
      SELECT json_build_object(
        'type', 'Feature',
        'id', osm_id,
        'geometry', ST_AsGeoJSON(way, 4326)::json,
        'properties', json_build_object(
          'name', name,
          'amenity', amenity
        )
      ) AS feature
      FROM puby) AS features
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const rails = async db => {
  try {
    const sql = `
    WITH rails AS (
      select osm_id, name, building, amenity, way from planet_osm_polygon
      where building = 'apartments'

    )
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(features.feature)
    )
    FROM (
      SELECT json_build_object(
        'type', 'Feature',
        'id', osm_id,
        'geometry', ST_AsGeoJSON(way, 4326)::json,
        'properties', json_build_object(
          'name', name
        )
      ) as feature
    FROM rails) AS features    
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};


// export const rails = async db => {
//   try {
//     const sql = `
//     WITH rails AS (
//       select * from planet_osm_roads as r
//       where r.railway = 'rail'
//     )
//     SELECT json_build_object(
//       'type', 'FeatureCollection',
//       'features', json_agg(features.feature)
//     )
//     FROM (
//       SELECT json_build_object(
//         'type', 'Feature',
//         'id', osm_id,
//         'geometry', ST_AsGeoJSON(way, 4326)::json,
//         'properties', json_build_object(
//           'name', name
//         )
//       ) as feature
//     FROM rails) AS features
//     `;
//     const result = await db.query(sql);
//     return result;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

export const within = db => async ({ x, y }) => {
  try {
    const sql = `
    WITH puby AS (
      SELECT st_distance(st_makepoint(${x}, ${y})::geography, p.way::geography) as dist, * 
      FROM planet_osm_point p
      WHERE amenity = 'pub' AND ST_DWithin(p.way, st_makepoint(${x}, ${y})::geography, 1000)
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
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const ubytovanie = db => async ({ boundaryId }) => {
  try {
    const sql = `
    WITH ubytovanie AS (
      select a.osm_id, a.name, a.way ,ST_AREA(a.way) as area from planet_osm_polygon as a
      inner join (select way from planet_osm_polygon where boundary = 'administrative' and admin_level = '9' and osm_id = '${boundaryId}') as b on ST_INTERSECTS(b.way, a.way)
      where a.building in ('yes', 'apartments', 'house', 'detached')
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
        'area', area
      )
    ) AS feature
    FROM ubytovanie) AS features

  
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const near = db => async ({ buildingId }) => {
  try {
    const radii = 3000;
    const amenityList = "('hospital', 'police', 'kindergarten', 'school')";
    const sql = `
    WITH boundaries AS (
      select a.osm_id, ST_DISTANCE(a.way::geography, b.way::geography) as distance, b.name, ST_CENTROID(b.way) as way, b.amenity from planet_osm_polygon as a
      inner join planet_osm_polygon as b on st_dwithin(a.way::geography, b.way::geography, ${radii})
      where a.osm_id = '${buildingId}' AND b.amenity in ${amenityList} and b.name is not null
      ORDER BY ST_DISTANCE(a.way, b.way) ASC
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
        'amenity', amenity,
        'distance', distance
      )
    ) AS feature
    FROM boundaries) AS features
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const boundaries = db => async () => {
  try {
    const sql = `
      WITH boundaries AS (
        select distinct osm_id, name, way, ST_AREA(way) as area, ST_CENTROID(way) as center from planet_osm_polygon
        where boundary = 'administrative' and admin_level = '9' and name is not null
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
          'area', area,
          'center', ST_ASGEOJSON(center)::json
        )
      ) AS feature
      FROM boundaries) AS features
    `;

    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};
