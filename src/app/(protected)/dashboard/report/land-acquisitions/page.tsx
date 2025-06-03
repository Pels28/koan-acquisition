"use client";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type Row,
  type SortingState,
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
import { Spinner, Tooltip } from "@heroui/react";
import { LandAcquisition } from "@/resources/states";
import useAxios from "@/utils/useAxios";
import useModal from "@/hooks/modalHook";
import swal from "sweetalert2"

const LandAcquisitionDashboard = () => {
  const api = useAxios();
  const [landAcquisitionData, setLandAcquisitionData] = useState<
    LandAcquisition[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const { showModal, closeModal, MemoizedModal } = useModal();

  const fetchLandAcquisitions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`land-acquisitions/`, {
        params: {
          page: pagination.pageIndex + 1,
          page_size: pagination.pageSize,
          search: searchTerm,
        },
      });

      setLandAcquisitionData(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch land acquisitions data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandAcquisitions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      
      // Optimistic UI update
      setLandAcquisitionData(prev => 
        prev.filter(item => item.id !== id)
      );
      setTotalCount(prev => prev - 1);
      
      // API call
      await api.delete(`land-acquisitions/${id}/`);
      
      // Success notification
      swal.fire({
        title: "work order deleted succesfully",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      
      // Revert on error
      fetchLandAcquisitions();
      
      // Error notification
      swal.fire({
        title: "Failed to delete",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setDeletingId(null);
      closeModal();
    }
  };

  const showDeleteModal = (id: number) => {
    showModal({
      backdrop: false,
      padded: true,
      size: "xl",
      children: (
        <div className="space-y-4 p-7 font-montserrat flex flex-col items-center justify-center">
          <div className="text-xl">Are you sure to delete this Land Acquisition?</div>

          <div className="w-full flex items-start justify-center gap-5">
            <Button 
              onPress={() => handleDelete(id)} 
              color="primary"
              isLoading={deletingId === id}
            >
              {deletingId === id ? "Deleting..." : "Yes, I wish to Delete"}
            </Button>
            <Button
              onPress={() => {
                closeModal();
              }}
              color="primary"
              variant="light"
              isDisabled={deletingId === id}
            >
              No, Cancel
            </Button>
          </div>
        </div>
      ),
      baseClassName: "!pb-0",
      onCloseCallback: () => {
        closeModal();
      },
    });
  };

  const columns: ColumnDef<LandAcquisition>[] = [
    {
      accessorKey: "propertyType",
      header: "Property Type",
      cell: ({ row }: { row: Row<LandAcquisition> }) => (
        <Link href={`/dashboard/report/land-acquisitions/${row.original.id}`}>
          <div className="flex items-center font-montserrat gap-2">
            <FiHome className="text-gray-400" />
            <span className="font-medium capitalize">
              {row.original.propertyType}
            </span>
          </div>
        </Link>
      ),
      size: 150,
    },
    {
      accessorKey: "location",
      header: "Location Details",
      cell: ({ row }: { row: Row<LandAcquisition> }) => (
        <div className="flex flex-col font-montserrat gap-1">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-400" />
            <span className="font-medium">
              {`${row.original.locationRegion}, ${row.original.locationDistrict}, ${row.original.locationRoad}`}
            </span>
          </div>
          {row.original.propertyType === "land" && row.original.landSize && (
            <div className="text-sm text-gray-600 ml-6">
              Plot Size: {row.original.landSize}
            </div>
          )}
          {row.original.propertyType === "station" &&
            row.original.stationCurrentOMC && (
              <div className="text-sm text-gray-600 ml-6">
                Current OMC: {row.original.stationCurrentOMC}
              </div>
            )}
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "estimatedCost",
      header: "Estimated Cost",
      cell: ({ row }: { row: Row<LandAcquisition> }) => (
        <div className="flex font-montserrat items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span className="font-medium">
            GHC {row.original.totalEstimatedCost?.toLocaleString()}
          </span>
        </div>
      ),
      size: 200,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<LandAcquisition> }) => (
        <div className="flex font-montserrat gap-2">
          <Link href={`/dashboard/report/land-acquisitions/${row.original.id}`}>
            <Tooltip content="view details">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <FiEye className="w-5 h-5" />
              </button>
            </Tooltip>
          </Link>
          <Link
            href={`/dashboard/report/land-acquisitions/edit/${row.original.id}/`}
          >
            <Tooltip content="edit">
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full">
                <FiEdit className="w-5 h-5" />
              </button>
            </Tooltip>
          </Link>
          <Tooltip content="delete" color="danger">
            <button
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              onClick={() => {
                showDeleteModal(row.original.id);
              }}
              disabled={deletingId === row.original.id}
            >
              {deletingId === row.original.id ? (
                <Spinner size="sm" />
              ) : (
                <FiTrash2 className="w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>
      ),
      size: 150,
    },
  ];

  const table = useReactTable({
    data: landAcquisitionData,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
      sorting,
      globalFilter: searchTerm,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                {totalCount} records found • Page {pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-[50%]">
              <Input
                startContent={<FaSearch />}
                labelPlacement="outside"
                label=""
                type="search"
                placeholder="Search acquisitions..."
                value={searchTerm}
                onChange={handleSearch}
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex justify-center">
                      <Spinner size="lg" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : landAcquisitionData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-500"
                  >
                    No acquisitions found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Items per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-3 py-1 border rounded-md"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  totalCount
                )}{" "}
                of {totalCount} items
              </span>
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
      {MemoizedModal}
    </div>
  );
};

export default LandAcquisitionDashboard;