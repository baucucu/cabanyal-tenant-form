import { createDirectus, rest, staticToken } from "@directus/sdk";

export const client = createDirectus("https://admin.cabanyalflats.com/")
  .with(staticToken(process.env.DIRECTUS_TOKEN))
  .with(rest());
