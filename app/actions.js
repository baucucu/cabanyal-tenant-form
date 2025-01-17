"use server";

import { z } from "zod";
import { client } from "@/lib/client";
import { updateItem } from "@directus/sdk";

const FormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  id_number: z.string().min(1, "ID number is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  tenant_id: z.string().min(1, "Tenant ID is required"),
  uploads: z.any(),
});

export async function registerUser(formData) {
  const validatedFields = FormSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    id_number: formData.get("id_number"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    country: formData.get("country"),
    address: formData.get("address"),
    tenant_id: formData.get("tenant_id"),
    uploads: formData.getAll("uploads").map((upload) => JSON.parse(upload)),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Register.",
    };
  }
  console.log({ validatedFields });
  validatedFields.data.uploads.map((file) => console.log({ file }));
  console.log({
    uploads: validatedFields.data.uploads,
    number: validatedFields.data.uploads.length,
  });
  // Here you would typically save the data to your database
  // For this example, we'll just return a success message
  const result = await client.request(
    updateItem("tenants", validatedFields.data.tenant_id, {
      first_name: validatedFields.data.first_name,
      last_name: validatedFields.data.last_name,
      id_number: validatedFields.data.id_number,
      phone: validatedFields.data.phone,
      email: validatedFields.data.email,
      country: validatedFields.data.country,
      permanent_address: validatedFields.data.address,
      uploads: validatedFields.data.uploads,
    })
  );

  if (result.error) {
    return {
      errors: result.error,
      message: "Failed to Register.",
    };
  } else {
    return {
      message: "Registration Successful!",
    };
  }
}
