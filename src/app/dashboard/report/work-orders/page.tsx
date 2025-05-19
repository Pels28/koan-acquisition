"use client";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
  FiPhone,
  FiChevronRight,
} from "react-icons/fi";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Tooltip } from "@heroui/react";
import Select, { ISelectOption } from "@/components/Select";

interface WorkOrder {
  id: number;
  workOrderNumber: string;
  date: string;
  requester: string;
  contact: string;
  location: string;
  priority: "high" | "medium" | "low";
  status: "Completed" | "In Progress" | "Pending";
  startDate: string;
  completionDate: string;
  assignedTechnician: string;
  serviceType: string;
}

const services = [
  "Pump maintenance",
  "Genset maintenance",
  "Canopy cleaning and repairs",
  "Safety equipment servicing",
  "Painting and cleaning",
  "Vehicle maintenance",
];

const mockWorkOrders: WorkOrder[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  workOrderNumber: `WO-${String(i + 1).padStart(3, "0")}`,
  date: new Date(2024, 0, i + 1).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  requester: `Requester ${i + 1}`,
  contact: `+1 (555) 555-${String(i + 1000).slice(1)}`,
  location: ["Main Facility", "East Wing", "Storage Unit #3"][i % 3],
  priority: ["high", "medium", "low"][i % 3] as "high" | "medium" | "low",
  status: ["Completed", "In Progress", "Pending"][i % 3] as
    | "Completed"
    | "In Progress"
    | "Pending",
  startDate: new Date(2024, 0, i + 2).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  completionDate: new Date(2024, 0, i + 5).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  assignedTechnician: `Tech. ${["Alice", "Bob", "Charlie"][i % 3]}`,
  serviceType: services[i % 6],
}));

const WorkOrderReports = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: "workOrderNumber",
      header: "Work Order",
      cell: ({ row }) => (
        <div className="flex flex-col font-montserrat">
          <Link
            href={`/dashboard/report/work-orders/${row.original.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
          >
            {row.getValue("workOrderNumber")}
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <FiCalendar className="text-gray-400" />
            <span>{row.original.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <FiMapPin className="text-gray-400" />
            <span>{row.original.location}</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiUser className="text-gray-400" />
              <span className="font-medium">
                {row.original.assignedTechnician}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 ">
              <FiPhone className="text-gray-400" />
              <span>{row.original.contact}</span>
            </div>
          </div>
        </div>
      ),
      size: 350,
    },
    {
      accessorKey: "serviceType",
      header: "Service Type",
      cell: ({ getValue }) => (
        <span className="font-medium font-montserrat text-gray-700">
          {getValue<string>()}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue<"high" | "medium" | "low">();
        const color = {
          high: "red",
          medium: "amber",
          low: "green",
        }[priority];

        return (
          <div className="flex items-center gap-2 font-montserrat">
            <span className={`w-3 h-3 rounded-full bg-${color}-500`} />
            <span className="capitalize font-medium">{priority}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusOptions: ISelectOption[] = [
          {
            id: "Completed",
            label: "Completed",
            value: "Completed",
            icon: <FiCheckCircle className="text-green-500" />,
            className: "bg-green-50 text-green-700",
          },
          {
            id: "In Progress",
            label: "In Progress",
            value: "In Progress",
            icon: <FiClock className="text-blue-500" />,
            className: "bg-blue-50 text-blue-700",
          },
          {
            id: "Pending",
            label: "Pending",
            value: "Pending",
            icon: <FiAlertTriangle className="text-amber-500" />,
            className: "bg-amber-50 text-amber-700",
          },
        ];
    
        const handleStatusChange = (selected?: ISelectOption | Array<ISelectOption>) => {
          if (selected) {
            // Handle both array and single selection cases
            const newStatus = Array.isArray(selected) 
              ? selected[0]?.value
              : selected?.value;
            
            if (newStatus) {
              setWorkOrders(prev =>
                prev.map(wo =>
                  wo.id === row.original.id ? { 
                    ...wo, 
                    status: newStatus as WorkOrder["status"] 
                  } : wo
                )
              );
            }
          }
        };
    
        return (
          <Select
            options={statusOptions}
            onValueChange={handleStatusChange}
            value={statusOptions.find(opt => opt.value === row.original.status)}
            valueRender={(items) => {
              const selectedItem = items[0]?.data;
              if (!selectedItem) return null;
              
              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedItem.className}`}>
                  {selectedItem.icon}
                  <span className="text-sm font-medium">{selectedItem.label}</span>
                </div>
              );
            }}
            variant="flat"
            size="sm"
            className="w-[160px]"
          />
        );
      },
      size: 200,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 font-montserrat">
          <Link
            href={`/dashboard/report/work-orders/${row.original.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
          >
            <Tooltip content="View Details">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <FiEye className="w-5 h-5" />
              </button>
            </Tooltip>
          </Link>
          <Tooltip content="Edit">
            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
              <FiEdit className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Delete" color="danger">
            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
              <FiTrash2 className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      ),
      size: 100,
    },
  ];

  const table = useReactTable({
    data: workOrders,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
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
                  Work Orders
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Work Order Reports
              </h1>
              <p className="text-gray-600">
                {table.getFilteredRowModel().rows.length} work orders found
              </p>
            </div>
            <div className="flex gap-1 w-full md:w-[50%]">
              <Input
                labelPlacement="outside"
                type="search"
                placeholder="Search work orders..."
                value={globalFilter ?? ""}
                fullWidth
                size="lg"
                rounded
                onChange={(e) => setGlobalFilter(e.target.value)}
                label=""
              />
              <Button
                size="lg"
                radius="md"
                color="primary"
                startContent={<FiSliders className="w-4 h-4 text-white" />}
              >
                Filters
              </Button>
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
                      {header.column.getCanSort() ? (
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:text-gray-900"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <FiChevronUp className="w-4 h-4" />,
                            desc: <FiChevronDown className="w-4 h-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} work orders
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 border rounded-md bg-white"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
                color="primary"
                variant="light"
              >
                Previous
              </Button>
              <Button
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
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

export default WorkOrderReports;