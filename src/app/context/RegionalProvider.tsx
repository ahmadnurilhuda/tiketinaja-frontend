"use client";
import React, { PropsWithChildren } from "react";
import repository from "../config/AxiosClientConfig";

const RegionalProviderContext = React.createContext({
  provinces: [],
  cities: [],
});

function RegionalProvider({ children }: PropsWithChildren) {
  const [provinces, setProvinces] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  const getProvince = async () => {
    try {
      const response = await repository.get("/public/regional/provinces");
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCity = async () => {
    try {
      const response = await repository.get("/public/regional/cities");
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const fetchProvince = async () => {
      const res = await getProvince();
      if (res) {
        setProvinces(res);
      }
    };
    fetchProvince();
  }, []);

  React.useEffect(() => {
    const fetchCity = async () => {
      const res = await getCity();
      if (res) {
        setCities(res);
      }
    };
    fetchCity();
  }, []);

  return (
    <RegionalProviderContext.Provider value={{ provinces, cities }}>
      {children}
    </RegionalProviderContext.Provider>
  );
}

export default RegionalProvider;
export const useRegional = () => React.useContext(RegionalProviderContext);
