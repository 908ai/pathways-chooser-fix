"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/integrations/supabase/types";
import { SERVICE_CATEGORIES, PROVINCES, PROVIDER_STATUSES, SERVICE_TYPES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const providerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  service_category: z.string().min(1, { message: "Please select a service category." }),
  location_city: z.string().min(2, { message: "City must be at least 2 characters." }),
  location_province: z.string().min(2, { message: "Please select a province." }),
  contact_email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  phone_number: z.string().optional(),
  website: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  description: z.string().optional(),
  logo_url: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  is_approved: z.boolean().default(false),
  cacea_member: z.boolean().default(false).refine(val => val === true, { message: "Provider must be a CACEA member." }),
  region: z.string().min(1, { message: "Please select a region." }),
  status: z.string().min(1, { message: "Please select a status." }),
  services_offered: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one service.",
  }),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface ProviderFormProps {
  onSubmit: (values: ProviderFormValues) => void;
  initialData?: Tables<'service_providers'>;
  isSubmitting: boolean;
}

export function ProviderForm({ onSubmit, initialData, isSubmitting }: ProviderFormProps) {
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: initialData?.name || "",
      service_category: initialData?.service_category || "",
      location_city: initialData?.location_city || "",
      location_province: initialData?.location_province || "",
      contact_email: initialData?.contact_email || "",
      phone_number: initialData?.phone_number || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
      logo_url: initialData?.logo_url || "",
      is_approved: initialData?.is_approved || false,
      cacea_member: initialData?.cacea_member || false,
      region: initialData?.region || "",
      status: initialData?.status || "",
      services_offered: initialData?.services_offered || [],
    },
  });

  const watchedRegion = useWatch({
    control: form.control,
    name: 'region',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Quality Insulation Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Saskatoon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Out-of-Region">Out-of-Region</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., contact@qualityinsulation.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., (306) 555-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://www.qualityinsulation.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe the provider's services." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services_offered"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Services Offered</FormLabel>
                <FormDescription>
                  Select the services this provider offers. Some services require a "Local" region.
                </FormDescription>
              </div>
              {SERVICE_TYPES.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="services_offered"
                  render={({ field }) => {
                    const isDisabled = item.localOnly && watchedRegion !== 'Local';
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, item.value]);
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.value
                                  )
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          {item.label}
                          {item.localOnly && <Badge variant="outline" className="ml-2">Local Only</Badge>}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROVIDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cacea_member"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>CACEA Member</FormLabel>
                <FormDescription>
                  Is this provider a member of CACEA?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_approved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Approved</FormLabel>
                <FormDescription>
                  Is this provider approved to be listed in the directory?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Provider"}
        </Button>
      </form>
    </Form>
  );
}