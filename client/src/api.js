const BASE_API_URL = 'http://localhost:12345/';

export const getBoundaries = async () => {
  const api = BASE_API_URL + 'kraje';

  try {
    return fetch(api);
  } catch (e) {
    console.error(e);
  }
};

export const getUbytovanie = async boundaryId => {
  const api = BASE_API_URL + 'ubytovanie?boundaryId=' + boundaryId;

  return fetch(api);
};

export const near = async buildingId => {
  const api = BASE_API_URL + 'near?buildingId=' + buildingId;
  
  return fetch(api);
};
