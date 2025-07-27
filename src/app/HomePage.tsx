'use client';
import React from "react";
import NavbarFront from "./(front)/components/NavbarFront";
import { useEventCategory } from "./context/EventCategoryProvider";
import { Category } from "@/types/EventCategory";

function HomePage() {
  const {eventCategory} = useEventCategory();
  return (
    <>
      <main>
        <NavbarFront />
        <div>HomePage</div>
        {eventCategory.map((category : Category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </main>
    </>
  );
}

export default HomePage;
