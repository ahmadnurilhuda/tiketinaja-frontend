import React from "react";
import RegisterPage from "./RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - TiketinAja",
  description: "Pilih TiketinAja sekarang!",
};

function page() {
  return (
    <>
      <RegisterPage />
    </>
  );
}

export default page;
