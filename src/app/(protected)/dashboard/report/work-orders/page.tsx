"use client";
import { useEffect, useState } from "react";
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
import { Spinner, Tooltip } from "@heroui/react";
import Select, { ISelectOption } from "@/components/Select";
import useAxios from "@/utils/useAxios";
import swal from "sweetalert2";
import useModal from "@/hooks/modalHook";

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  date: string;
  requester: string;
  contactNumber: string;
  assignedTechnician: string;
  location: string;
  description: string;
  startDate: string;
  completionDate: string;
  priority: string;
  partsAndMaterials: string;
  specialInstructions: string;
  serviceType?: string;
  status?: "Completed" | "In Progress" | "Pending";
}

const WorkOrderReports = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const api = useAxios();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {MemoizedModal, showModal, closeModal} = useModal()
  // ... other states

  // ... fetchWorkOrder useEffect

  const showDeleteModal = (workOrder: WorkOrder) => {
    showModal({
      backdrop: false,
      padded: true,
      size: "xl",
      children: (
        <div className="space-y-4 p-7 font-montserrat flex flex-col items-center justify-center">
          <div className="text-xl">{`Are you sure to delete Work Order ${workOrder.workOrderNumber}?`}</div>

          <div className="w-full flex items-start justify-center gap-5">
            <Button 
              onPress={() => handleDelete(workOrder)} 
              color="primary"
              isLoading={deletingIds.includes(workOrder.id)}
            >
              {deletingIds.includes(workOrder.id) 
                ? "Deleting..." 
                : "Yes, I wish to Delete"
              }
            </Button>
            <Button
              onPress={() => closeModal()}
              color="primary"
              variant="light"
              isDisabled={deletingIds.includes(workOrder.id)}
            >
              No, Cancel
            </Button>
          </div>
        </div>
      ),
      baseClassName: "!pb-0",
      onCloseCallback: closeModal,
    });
  };


  const handleDelete = async (workOrder: WorkOrder) => {
    try {
      setDeletingIds((prev) => [...prev, workOrder.id]);
      
      // Optimistic UI update
      setWorkOrders((prev) => prev.filter((wo) => wo.id !== workOrder.id));
      setTotalCount(prev => prev - 1); // Update total count

      await api.delete(`work-orders/${workOrder.id}`);
      
      swal.fire({
        title: "Work order deleted successfully",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      
      // Revert on error
      setWorkOrders((prev) => [...prev, workOrder]);
      setTotalCount(prev => prev + 1); // Revert count
      
      swal.fire({
        title: "Failed to delete work order",
        text: error.response?.data?.message || "Please try again later",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== workOrder.id));
      closeModal(); // Close modal after operation
      
      // Refetch data to ensure consistency
      if (workOrders.length - 1 <= pagination.pageSize) {
        const { data, totalCount } = await fetchWorkOrders(
          pagination.pageIndex,
          pagination.pageSize
        );
        setWorkOrders(data);
        setTotalCount(totalCount);
      }
    }
  };

  const fetchWorkOrders = async (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `work-orders/?page=${pageIndex + 1}&page_size=${pageSize}`
      );

      // Handle both paginated and non-paginated responses
      const responseData = response.data.results || response.data;

      if (!Array.isArray(responseData)) {
        throw new Error("API response data is not an array");
      }

  

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = responseData.map((apiOrder: any) => ({
        id: apiOrder.id.toString(),
        workOrderNumber: apiOrder.work_order_number,
        date: apiOrder.date,
        requester: apiOrder.requester,
        contactNumber: apiOrder.contact_number,
        assignedTechnician: apiOrder.assigned_technician,
        location: apiOrder.location,
        description: apiOrder.description,
        startDate: apiOrder.start_date,
        completionDate: apiOrder.completion_date,
        priority: apiOrder.priority,
        partsAndMaterials: apiOrder.parts_and_materials,
        specialInstructions: apiOrder.special_instructions,
        status: apiOrder.status 
        ? apiOrder.status === 'in_progress' ? 'In Progress' 
          : apiOrder.status.charAt(0).toUpperCase() + apiOrder.status.slice(1)
        : 'Pending'
      }));

 

      return {
        data: transformedData,
        totalCount: response.data.count || responseData.length,
      };
    } catch (error) {
      console.error("Failed to fetch work orders:", error);
      return {
        data: [],
        totalCount: 0,
      };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { data, totalCount } = await fetchWorkOrders(
        pagination.pageIndex,
        pagination.pageSize
      );
      setWorkOrders(data);
      setTotalCount(totalCount);
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

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
              <span>{row.original.contactNumber}</span>
            </div>
          </div>
        </div>
      ),
      size: 350,
    },
    {
      accessorKey: "description",
      header: "Description",
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
            id: "completed",
            label: "Completed",
            value: "Completed",
            icon: <FiCheckCircle className="text-green-500" />,
            className: "bg-green-50 text-green-700",
          },
          {
            id: "in_progress",
            label: "In Progress",
            value: "In Progress",
            icon: <FiClock className="text-blue-500" />,
            className: "bg-blue-50 text-blue-700",
          },
          {
            id: "pending",
            label: "Pending",
            value: "Pending",
            icon: <FiAlertTriangle className="text-amber-500" />,
            className: "bg-amber-50 text-amber-700",
          },
        ];
    
        // Get the current status value
        const currentStatus = row.original.status || 'Pending';
    
        const handleStatusChange = async (
          selected?: ISelectOption | Array<ISelectOption>
        ) => {
          if (!selected) return;
    
          const newStatus = Array.isArray(selected)
            ? selected[0]?.value
            : selected?.value;
    
          if (!newStatus) return;
    
          const workOrderId = row.original.id;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const currentBackendStatus = row.original.status === 'In Progress' 
            ? 'in_progress' 
            : (row.original.status || 'pending').toLowerCase();
    
          // Optimistic UI update
          setWorkOrders((prev) =>
            prev.map((wo) =>
              wo.id === workOrderId
                ? { ...wo, status: newStatus as WorkOrder["status"] }
                : wo
            )
          );
    
          try {
            // Convert to backend format
            const backendStatus = newStatus === 'In Progress' 
              ? 'in_progress' 
              : newStatus.toLowerCase();
    
            await api.patch(`work-orders/${workOrderId}/`, {
              status: backendStatus
            });
          } catch (error) {
            console.error("Failed to update status:", error);
            // Revert on error
            setWorkOrders((prev) =>
              prev.map((wo) =>
                wo.id === workOrderId
                  ? { ...wo, status: currentStatus }
                  : wo
              )
            );
          }
        };
    
        return (
          <Select
            options={statusOptions}
            onValueChange={handleStatusChange}
            value={statusOptions.find(
              (opt) => opt.value === currentStatus
            )}
            valueRender={(items) => {
              const selectedItem = items[0]?.data;
              if (!selectedItem) return null;
    
              return (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedItem.className}`}
                >
                  {selectedItem.icon}
                  <span className="text-sm font-medium">
                    {selectedItem.label}
                  </span>
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
          <Link href={`/dashboard/report/work-orders/edit/${row.original.id}`}>
            <Tooltip content="Edit">
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                <FiEdit className="w-5 h-5" />
              </button>
            </Tooltip>
          </Link>
          <Tooltip content="Delete" color="danger">
            <button
              onClick={() => showDeleteModal(row.original)}
              disabled={deletingIds.includes(row.original.id)}
              className={`p-2 rounded-full transition-colors ${
                deletingIds.includes(row.original.id)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              {deletingIds.includes(row.original.id) ? (
                <Spinner size="sm" /> // Add your spinner component
              ) : (
                <FiTrash2 className="w-5 h-5" />
              )}
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
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-24 text-center"
                  >
                    <Spinner size="lg" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center"
                  >
                    No work orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing {pagination.pageIndex * pagination.pageSize + 1}-
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  totalCount
                )}{" "}
                of {totalCount} work orders
              </span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    pageIndex: 0, // Reset to first page
                  }));
                }}
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
      {MemoizedModal}
    </div>
  );
};

export default WorkOrderReports;
