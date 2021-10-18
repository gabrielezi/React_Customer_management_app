import { Location } from "../models/Location";
import { GEOCODING_URL } from "../constants/requests";

export const getCoordinatesHttpRequest = async (
  address: string
): Promise<Location> => {
  const response = await fetch(GEOCODING_URL + address);
  const data = (await response.json()) as Location;

  return data;
};
