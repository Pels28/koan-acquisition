"use client";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Row,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiEdit,
  FiEye,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import Input from "@/components/Input";
import { FaSearch } from "react-icons/fa";
import Button from "@/components/Button";
import { Tooltip } from "@heroui/react";

type Acquisition = {
  id: number;
  reference: string;
  propertyType: string;
  location: string;
  size: string;
  value: string;
  stationType: string;
  currentOMC: string;
  debt: string;
  tankCapacity: {
    diesel: string;
    super: string;
  };
  leaseYears: number;
  remainingLease: number;
  status: string;
  worksRequired: string;
  estimatedCost: string;
};

const mockAcquisitions: Acquisition[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  reference: `LA-${String(i + 1).padStart(3, "0")}`,
  propertyType: i % 2 === 0 ? "Land" : "Station",
  location: `${["Northern", "Central", "Southern"][i % 3]} Region`,
  size: `${(i + 1) * 1000} sqm`,
  value: `GHC ${(i + 1) * 50000}`,
  stationType: ["Fuel", "LPG", "CRM"][i % 3],
  currentOMC: ["OMC A", "OMC B", "OMC C"][i % 3],
  debt: `GHC ${(i + 1) * 10000}`,
  tankCapacity: {
    diesel: `${(i + 1) * 5000}L`,
    super: `${(i + 1) * 3000}L`,
  },
  leaseYears: 10 + i,
  remainingLease: 10 + i - 2,
  status: ["Pending", "Approved", "Rejected"][i % 3],
  worksRequired: ["Forecourt", "Canopy", "Electricals"][i % 3],
  estimatedCost: `GHC ${(i + 1) * 150000}`,
}));

const LandAcquisitionDashboard = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Acquisition>[] = [
    {
      accessorKey: "propertyType",
      header: "Property Type",
      cell: ({ row }: { row: Row<Acquisition> }) => (
        <Link href={`/dashboard/report/land-acquisitions/${row.original.id}`}>
          <div className="flex items-center font-montserrat gap-2">
            <FiHome className="text-gray-400" />
            <span className="font-medium">{row.original.propertyType}</span>
          </div>
        </Link>
      ),
      size: 150,
    },
    {
      accessorKey: "location",
      header: "Location Details",
      cell: ({ row }: { row: Row<Acquisition> }) => (
        <div className="flex flex-col font-montserrat gap-1">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-400" />
            <span className="font-medium">{row.original.location}</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">
            Size: {row.original.size}
          </div>
          <div className="text-sm text-gray-600 ml-6">
            Current OMC: {row.original.currentOMC}
          </div>
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "estimatedCost",
      header: "Estimated Cost",
      cell: ({ row }: { row: Row<Acquisition> }) => (
        <div className="flex font-montserrat items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span className="font-medium">{row.original.estimatedCost}</span>
        </div>
      ),
      size: 200,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Acquisition> }) => (
        <div className="flex font-montserrat gap-2">
          <Link href={`/dashboard/report/land-acquisitions/${row.original.id}`}>
            <Tooltip content="view details">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <FiEye className="w-5 h-5" />
              </button>
            </Tooltip>
          </Link>
          <Tooltip content="edit">
            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full">
              <FiEdit className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="delete" color="danger">
            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full">
              <FiTrash2 className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      ),
      size: 150,
    },
  ];

  const table = useReactTable({
    data: mockAcquisitions,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full font-montserrat">
      <div className="px-6 pt-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <div className="flex items-center">
                <Link
                  href="/dashboard/report"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Report Dashboard
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Land Acquisitions
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Table Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Land Acquisitions
              </h1>
              <p className="text-gray-600">
                {table.getFilteredRowModel().rows.length} records found
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-[50%]">
              <Input
                startContent={<FaSearch />}
                labelPlacement="outside"
                label=""
                type="search"
                placeholder="Search acquisitions..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                size="lg"
                radius="md"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 border rounded-md"
              >
                {[10, 20, 30].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
                size="md"
                color="primary"
                variant="light"
              >
                Previous
              </Button>
              <Button
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
                size="md"
                color="primary"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandAcquisitionDashboard;
