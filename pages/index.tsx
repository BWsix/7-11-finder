import type { NextPage } from "next";
import { useEffect, useState } from "react";
import stores from "../stores.json";

interface Location {
  lat: number | null;
  lon: number | null;
}
interface Store {
  address: string;
  lat: number;
  lon: number;
}

const getNearestStoreLocation = (currentLocation: Location) => {
  if (currentLocation.lat === null || currentLocation.lon === null) {
    return null;
  }

  let currentNearestDistance = Number.MAX_VALUE;
  let currentNearestAddress = "";

  (stores as Store[]).forEach((store) => {
    const deltaLat = currentLocation.lat! - store.lat;
    const deltaLon = currentLocation.lon! - store.lon;

    const distance = Math.sqrt(deltaLat ** 2 + deltaLon ** 2);
    if (distance < currentNearestDistance) {
      currentNearestDistance = distance;
      currentNearestAddress = store.address;
    }
  });

  return currentNearestAddress;
};

const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setAddress(() => getNearestStoreLocation(currentLocation));
      },
      (err) => {
        if (err.PERMISSION_DENIED) {
          alert("無法取得位置資訊，請開啟定位模式並重新載入頁面");
        }
        alert(err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const googleMapLink = `https://maps.google.com/maps?daddr=${address}`;
  if (!!address) {
    window.location.replace(googleMapLink);
  }

  return <>7-11 finder</>;
};

export default Home;
