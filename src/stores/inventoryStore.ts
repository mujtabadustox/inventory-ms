import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface InventoryFilters {
  category: string;
  status: "all" | "in-stock" | "low-stock" | "out-of-stock";
  search: string;
  sortBy: "name" | "quantity" | "price" | "date";
  sortOrder: "asc" | "desc";
}

interface InventoryState {
  // Filters and UI State
  filters: InventoryFilters;
  selectedItems: string[];
  viewMode: "grid" | "list" | "table";

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Bulk Actions
  isBulkEditing: boolean;
  bulkAction: "delete" | "update" | "export" | null;

  // Actions
  setFilters: (filters: Partial<InventoryFilters>) => void;
  resetFilters: () => void;
  setSelectedItems: (items: string[]) => void;
  toggleItemSelection: (itemId: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: "grid" | "list" | "table") => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setBulkEditing: (editing: boolean) => void;
  setBulkAction: (action: "delete" | "update" | "export" | null) => void;
}

const defaultFilters: InventoryFilters = {
  category: "",
  status: "all",
  search: "",
  sortBy: "name",
  sortOrder: "asc",
};

export const useInventoryStore = create<InventoryState>()(
  devtools(
    (set) => ({
      // Initial State
      filters: defaultFilters,
      selectedItems: [],
      viewMode: "table",
      currentPage: 1,
      itemsPerPage: 20,
      isBulkEditing: false,
      bulkAction: null,

      // Actions
      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
            currentPage: 1, // Reset to first page when filters change
          }),
          false,
          "inventory/setFilters"
        ),

      resetFilters: () =>
        set(
          { filters: defaultFilters, currentPage: 1 },
          false,
          "inventory/resetFilters"
        ),

      setSelectedItems: (items) =>
        set({ selectedItems: items }, false, "inventory/setSelectedItems"),

      toggleItemSelection: (itemId) =>
        set(
          (state) => ({
            selectedItems: state.selectedItems.includes(itemId)
              ? state.selectedItems.filter((id) => id !== itemId)
              : [...state.selectedItems, itemId],
          }),
          false,
          "inventory/toggleItemSelection"
        ),

      clearSelection: () =>
        set({ selectedItems: [] }, false, "inventory/clearSelection"),

      setViewMode: (mode) =>
        set({ viewMode: mode }, false, "inventory/setViewMode"),

      setCurrentPage: (page) =>
        set({ currentPage: page }, false, "inventory/setCurrentPage"),

      setItemsPerPage: (count) =>
        set(
          { itemsPerPage: count, currentPage: 1 },
          false,
          "inventory/setItemsPerPage"
        ),

      setBulkEditing: (editing) =>
        set({ isBulkEditing: editing }, false, "inventory/setBulkEditing"),

      setBulkAction: (action) =>
        set({ bulkAction: action }, false, "inventory/setBulkAction"),
    }),
    {
      name: "inventory-store",
    }
  )
);
