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
    `;
    const result = await db.query(sql);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};
