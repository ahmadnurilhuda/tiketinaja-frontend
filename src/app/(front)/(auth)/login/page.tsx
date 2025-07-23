import { Metadata } from 'next';
import React from 'react'
import LoginPage from './LoginPage';


export const metadata: Metadata = {
  title: "Login - TiketinAja",
  description: "Pilih TiketinAja sekarang!",
};
function page() {
  return (
    <>
      <LoginPage />
    </>
  )
}

export default page