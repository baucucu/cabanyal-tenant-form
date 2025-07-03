"use client";
import { useRef, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import UploadsList from "@/components/UploadsList";
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

export function RegistrationForm({ registerUser, tenant }) {
  const formRef = useRef(null);
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const router = useRouter();
  // console.log({ tenant });

  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    if (uploads) {
      console.log({ uploads });
    }
  }, [uploads]);

  async function handleUploadDelete(id) {
    setUploads(uploads.filter((file) => file.handle !== id));
  }

  async function onSubmit(formData) {
    formData.append("tenant_id", tenant.id);
    uploads.map((file) => {
      formData.append("uploads", JSON.stringify({ url: file.url }));
    });

    const result = await registerUser(formData);
    if (result.errors) {
      // Handle errors
      Object.entries(result.errors).forEach(([key, value]) => {
        toast({
          title: "Error",
          description: `${key}: ${value}`,
          variant: "destructive",
        });
      });
    } else {
      // Send webhook to n8n
      try {
        const data = Object.fromEntries(formData.entries());
        const fileUrls = uploads.map((file) => file.url);
        await fetch("/api/forward-to-n8n", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            fileUrls,
          }),
        });
      } catch (err) {
        console.error("Failed to send webhook to n8n", err);
      }
      toast({
        title: "Success",
        description: result.message,
      });
      router.push("/thankyou");
    }
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-8">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Cabanyal Flats tenant registration</CardTitle>
          <CardDescription>
            Please fill in all the required fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  required
                  defaultValue={tenant?.first_name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  required
                  defaultValue={tenant?.last_name}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber">National ID Number</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  required
                  defaultValue={tenant?.id_number}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  defaultValue={tenant?.phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Address</Label>
              <Input
                id="address"
                name="address"
                required
                defaultValue={tenant?.permanent_address}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                required
                defaultValue={tenant?.country}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={tenant?.email}
              />
            </div>
            <div className="space-y-2">
              <FileUploaderRegular
                useCloudImageEditor={false}
                sourceList="local, camera, gdrive"
                filesViewMode="grid"
                classNameUploader="uc-light"
                pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBKEY}
                onCommonUploadSuccess={(e) => {
                  const uploadedFiles = e.successEntries.map((entry) => ({
                    url: entry.cdnUrl,
                    filename: entry.fileInfo?.name,
                    handle: entry.uuid || entry.fileInfo?.uuid || entry.cdnUrl
                  }));
                  setUploads((prev) => [...prev, ...uploadedFiles]);
                }}
              />
              <UploadsList
                uploads={uploads}
                handleUploadDelete={handleUploadDelete}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
