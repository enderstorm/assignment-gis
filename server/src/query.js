export const queryTime = async db => {
  try {
    const result = await db.query('SELECT NOW() as now');
    return result.rows[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};
