"use client";
import React, { PropsWithChildren } from "react";
import repository from "../config/AxiosClientConfig";

const EventCategoryContext = React.createContext({
    eventCategory: [],
});

function EventCategoryProvider({ children }: PropsWithChildren) {
  const [eventCategory, setEventCategory] = React.useState([]);

  const getEventCategory = async () => {
    try {
      const response = await repository.get("/public/event-categories");
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const fetchEventCategory = async () => {
      const res = await getEventCategory();
      if (res) {
        setEventCategory(res);
      }
    };
    fetchEventCategory();
  }, []);

  return (
    <EventCategoryContext.Provider value={{ eventCategory }}>
      {children}
    </EventCategoryContext.Provider>
  );
}

export default EventCategoryProvider;
export const useEventCategory = () => React.useContext(EventCategoryContext);
