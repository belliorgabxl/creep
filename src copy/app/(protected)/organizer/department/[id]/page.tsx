import React from "react";
import ClientDepartmentDetail from "./ClientDepartmentDetail";

export default async function Page({ params }: { params: { id: string } }) {
  // cast params (await params is required in app-router)
  const { id } = (await params) as { id: string };

  return <ClientDepartmentDetail id={id} />;
}