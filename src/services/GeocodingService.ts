import { Location } from "../types/Location";
import { Service } from "../types/Service";
import { GEOCODING_URL } from "../constants/requests";

export const getCoordinatesHttpRequest = async (
  address: string
): Promise<Location> => {
  const response = await fetch(GEOCODING_URL + address);
  const data = (await response.json()) as Location;

  console.log(data);

  return data;
};
