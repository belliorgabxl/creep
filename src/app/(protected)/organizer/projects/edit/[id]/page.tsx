import EditProjectClient from "@/components/project/EditProjectClient";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditProjectClient id={id} />;
}