"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ServiceProvider } from "@/integrations/supabase/types";

export const getColumns = (
  onEdit: (provider: ServiceProvider) => void,
  onDelete: (provider: ServiceProvider) => void,
  onToggleApproved: (provider: ServiceProvider, isApproved: boolean) => void
): ColumnDef<ServiceProvider>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "service_category",
    header: "Category",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const { location_city, location_province } = row.original;
      return `${location_city || ""}, ${location_province || ""}`;
    },
  },
  {
    accessorKey: "is_approved",
    header: "Approved",
    cell: ({ row }) => {
      const provider = row.original;
      return (
        <Switch
          checked={provider.is_approved}
          onCheckedChange={(value) => onToggleApproved(provider, value)}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const provider = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(provider)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(provider)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];