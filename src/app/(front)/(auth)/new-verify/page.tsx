import React from 'react'
import NewVerifyPage from './NewVerifyPage'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "New Verify - TiketinAja",
  description: "Pilih TiketinAja sekarang!",
};

function page() {
  return (
    <>
      <NewVerifyPage />
    </>
  )
}

export default page