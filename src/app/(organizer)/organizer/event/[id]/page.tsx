import React from 'react'
import OrganizerDetailEvent from './OrganizerDetailEvent'
import { getEvent } from '../EventActions';




async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getEvent(id);
  if (!data) {
    return <div>Event tidak ditemukan atau gagal dimuat.</div>;
  }
  return (
    <>
      <OrganizerDetailEvent initialData={data} />
    </>
  );
}

export default page