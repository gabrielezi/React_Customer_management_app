import { Location } from "../types/Location";
import { Service } from "../types/Service";
import { GEOCODING_URL } from "../constants/requests";

export const getCoordinatesHttpRequest = async (
    address: string
  ): Promise<Location> => {

    console.log(GEOCODING_URL + address);
    const response = await fetch(GEOCODING_URL + address);
    const data = await response.json() as Location;

    // const request = fetch(
    //     "http://api.positionstack.com/v1/forward?access_key=c924dc709ce08a7b2f89dfcf538e7c20&query=Vilkpėdės g. 7, Vilnius"
    //   )
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));
  
    
    // const response = await request.send();
    // const coordinates = (await response.json()) as Location;
    console.log(data);
    return data;
  };