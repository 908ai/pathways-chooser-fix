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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  cacea_member: z.boolean().default(false),
  region: z.string().min(1, { message: "Please select a region." }),
  status: z.string().min(1, { message: "Please select a status." }),
  services_offered: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one service.",
  }),
  other_service_text: z.string().optional(),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface ProviderFormProps {
  onSubmit: (values: Omit<ProviderFormValues, 'other_service_text'>) => void;
  initialData?: Tables<'service_providers'>;
  isSubmitting: boolean;
}

export function ProviderForm({ onSubmit, initialData, isSubmitting }: ProviderFormProps) {
  const getInitialOtherService = () => {
    const otherService = initialData?.services_offered?.find(s => !SERVICE_TYPES.map(st => st.value).includes(s));
    return otherService || "";
  }

  const getInitialServicesOffered = () => {
    const initialServices = initialData?.services_offered || [];
    const otherService = initialServices.find(s => !SERVICE_TYPES.map(st => st.value).includes(s));
    if (otherService) {
      return [...initialServices.filter(s => s !== otherService), "Other specialized services"];
    }
    return initialServices;
  }

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
      status: initialData?.status || "Pending",
      services_offered: getInitialServicesOffered(),
      other_service_text: getInitialOtherService(),
    },
  });

  const watchedProvince = useWatch({
    control: form.control,
    name: 'location_province',
  });

  const watchedRegion = useWatch({
    control: form.control,
    name: 'region',
  });

  const watchedServices = useWatch({
    control: form.control,
    name: 'services_offered',
  });

  useEffect(() => {
    if (watchedProvince === 'AB') {
      form.setValue('region', 'Local');
    } else if (watchedProvince) {
      form.setValue('region', 'Out-of-Region');
    }
  }, [watchedProvince, form]);

  const handleFormSubmit = (values: ProviderFormValues) => {
    const { other_service_text, ...rest } = values;
    const finalServices = [...values.services_offered];
    
    if (values.services_offered.includes("Other specialized services")) {
      const index = finalServices.indexOf("Other specialized services");
      if (other_service_text) {
        finalServices.splice(index, 1, other_service_text);
      } else {
        finalServices.splice(index, 1);
      }
    }
    
    onSubmit({ ...rest, services_offered: finalServices });
  };

  const getStatusClass = (status: string, selectedStatus: string) => {
    const base = "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors";
    const statusColors: { [key: string]: string } = {
      Available: "border-green-500 text-green-500 hover:bg-green-50",
      "At Capacity": "border-yellow-500 text-yellow-500 hover:bg-yellow-50",
      Pending: "border-red-500 text-red-500 hover:bg-red-50",
    };
    const selectedColors: { [key: string]: string } = {
      Available: "bg-green-500 text-white",
      "At Capacity": "bg-yellow-500 text-white",
      Pending: "bg-red-500 text-white",
    };

    if (status === selectedStatus) {
      return cn(base, selectedColors[status]);
    }
    return cn(base, statusColors[status] || "border-gray-300 text-gray-500 hover:bg-gray-50");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  <Input placeholder="e.g., Calgary" {...field} />
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
              <FormControl>
                <Input {...field} readOnly className="bg-muted" />
              </FormControl>
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
                <Input placeholder="e.g., (403) 555-1234" {...field} />
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
                  Select the services this provider offers. Some services require a "Local" region (Alberta).
                </FormDescription>
              </div>
              <div className="space-y-2">
                {SERVICE_TYPES.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="services_offered"
                    render={({ field }) => {
                      const isDisabled = item.localOnly && watchedRegion !== 'Local';
                      return (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              disabled={isDisabled}
                              onCheckedChange={(checked) => {
                                let newValue: string[];
                                if (checked) {
                                  newValue = [...(field.value || []), item.value];
                                } else {
                                  newValue = field.value?.filter(
                                    (value) => value !== item.value
                                  );
                                }
                                field.onChange(newValue);
                              }}
                              className="border-2 border-gray-400"
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
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchedServices?.includes("Other specialized services") && (
          <FormField
            control={form.control}
            name="other_service_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Service</FormLabel>
                <FormControl>
                  <Input placeholder="Specify the other service" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-2"
                >
                  {PROVIDER_STATUSES.map((status) => (
                    <FormItem key={status} className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={status} className="sr-only" />
                      </FormControl>
                      <FormLabel className={getStatusClass(status, field.value)}>
                        {status}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
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