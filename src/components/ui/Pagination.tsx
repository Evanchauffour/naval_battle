"use client";

import React, { useEffect } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalItems: number;
  totalPages: number;
}

export default function Pagination({
  indexOfFirstUser,
  indexOfLastUser,
  totalItems,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      params.set("page", pageNumber.toString());
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!searchParams.get("page")) {
      handlePageChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getVisiblePages = () => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 w-full">
      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
        Affichage de {Number(indexOfFirstUser) + 1} à{" "}
        {Math.min(Number(indexOfLastUser), totalItems)} sur {totalItems}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Number(searchParams.get("page")) - 1)}
          disabled={Number(searchParams.get("page")) === 1}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <Button
                  variant={
                    Number(searchParams.get("page")) === page
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  onClick={() => handlePageChange(page as number)}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex sm:hidden items-center gap-1">
          <span className="text-xs text-gray-600 px-2">
            {Number(searchParams.get("page")) || 1} / {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Number(searchParams.get("page")) + 1)}
          disabled={Number(searchParams.get("page")) >= totalPages}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}

