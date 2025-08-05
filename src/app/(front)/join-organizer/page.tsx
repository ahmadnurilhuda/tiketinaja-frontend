import React from 'react'
import JoinOrganizer from './JoinOrganizer'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Join Organizer - TiketinAja",
  description: "Pilih TiketinAja sekarang!",
};

function page() {
  return (
    <>
    <JoinOrganizer />
    </>
  )
}

export default page