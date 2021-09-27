const BASE_URL = 'https://www.metaweather.com/api/location'

export async function getLocations({ query }) {
  if (query) {
    const response = await fetch(`${BASE_URL}/search/?query=${query}`);
    const data = await response.json()
    return data;
  }

  return [];
}

export async function getLocation({ woeid }) {
  if (woeid > -1) {
    const response = await fetch(`${BASE_URL}/${woeid}/`);
    const data = await response.json()
    return data;
  }

  return null;
}
