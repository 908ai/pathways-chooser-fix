"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ServiceProvider } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PROVINCE_OPTIONS, SERVICE_CATEGORIES } from "@/components/NBCCalculator/constants/options";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  service_category: z.string().min(1, "Service category is required."),
  location_city: z.string().optional(),
  location_province: z.string().optional(),
  contact_email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone_number: z.string().optional(),
  website: z.string().url("Invalid URL.").optional().or(z.literal('')),
  description: z.string().optional(),
  logo_url: z.string().url("Invalid URL.").optional().or(z.literal('')),
  is_approved: z.boolean().default(false),
});

type ProviderFormValues = z.infer<typeof formSchema>;

interface ProviderFormProps {
  provider?: ServiceProvider | null;
  onSave: () => void;
  setOpen: (open: boolean) => void;
}

export function ProviderForm({ provider, onSave, setOpen }: ProviderFormProps) {
  const { toast } = useToast();
  const isEditMode = !!provider;

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: provider?.name ?? "",
      service_category: provider?.service_category ?? "",
      location_city: provider?.location_city ?? "",
      location_province: provider?.location_province ?? "",
      contact_email: provider?.contact_email ?? "",
      phone_number: provider?.phone_number ?? "",
      website: provider?.website ?? "",
      description: provider?.description ?? "",
      logo_url: provider?.logo_url ?? "",
      is_approved: provider?.is_approved ?? false,
    },
  });

  const onSubmit = async (values: ProviderFormValues) => {
    const { data, error } = isEditMode
      ? await supabase
          .from("service_providers")
          .update(values)
          .eq("id", provider.id)
          .select()
      : await supabase.from("service_providers").insert([values]).select();

    if (error) {
      toast({
        title: "Error saving provider",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Provider ${isEditMode ? "updated" : "created"}`,
        description: `Successfully ${isEditMode ? "updated" : "created"} ${values.name}.`,
      });
      onSave();
      setOpen(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit" : "Add"} Service Provider</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Provider Name" {...field} />
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
            <FormField
              control={form.control}
              name="location_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
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
                      {PROVINCE_OPTIONS.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
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
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
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
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the provider." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_approved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Approved
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}