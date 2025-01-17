import { RegistrationForm } from "@/components/RegistrationForm";
import { registerUser } from "../actions";
import { readItems } from "@directus/sdk";
import { client } from "@/lib/client";

export default async function Page({ params }) {
  const tenant_id = (await params).tenant_id;

  // console.log({ tenant_id });
  const result = await client.request(
    readItems("tenants", {
      filter: {
        tenant_id: {
          _eq: tenant_id, // Ensure tenant_id is defined correctly
        },
      },
      limit: 1,
      fields: ["*.*"],
    })
  );

  if (!tenant_id || result.error) {
    return (
      <main className="container mx-auto p-4">
        <h1>404</h1>
      </main>
    );
  }
  return (
    //center on page
    <main className="container mx-auto p-4 space-y-8 flex justify-center items-center h-screen">
      <RegistrationForm registerUser={registerUser} tenant={result[0]} />
    </main>
  );
}
