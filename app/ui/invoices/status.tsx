"use client";

import { useOptimisticUpdate } from "@/app/hooks/use-optimistic-update";
import { updateInvoiceStatus } from "@/app/lib/actions";
import { INVOICE_OVERDUE_AFTER_DAYS } from "@/app/lib/constants";
import { invoiceStatuses, InvoiceStatusType } from "@/app/lib/definitions";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { startTransition, useState } from "react";

export default function InvoiceStatus({
  id,
  status,
  date,
  updateStatus,
}: {
  id: string;
  status: InvoiceStatusType;
  date: Date;
  updateStatus: (id: string, newStatus: InvoiceStatusType) => Promise<any>;
}) {
  const today = new Date();
  const twoWeeksAgo = new Date(
    today.getTime() - INVOICE_OVERDUE_AFTER_DAYS * 24 * 60 * 60 * 1000
  );
  const [currentStatus, setCurrentStatus] = useOptimisticUpdate(status);

  const displayStatus: InvoiceStatusType | "overdue" =
    currentStatus === "pending" && new Date(date) < twoWeeksAgo
      ? "overdue"
      : currentStatus;

  console.log(
    "displayStatus",
    displayStatus,
    "currentStatus",
    currentStatus,
    id
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleStatusUpdate = async (newStatus: InvoiceStatusType) => {
    await setCurrentStatus(newStatus, async () => {
      try {
        const response = await updateInvoiceStatus(id, newStatus);

        if (response.status !== 204) {
          console.error(response.message || "Failed to update invoice status.");
          alert(response.message || "Failed to update invoice status.");
        }
      } catch (error) {
        console.error("Error updating invoice:", error);
      }
    });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium focus:outline-none",
          {
            "bg-gray-100 text-violet-500": displayStatus === "canceled",
            "bg-gray-100 text-red-500": displayStatus === "overdue",
            "bg-gray-100 text-gray-500": displayStatus === "pending",
            "bg-green-500 text-white": displayStatus === "paid",
          }
        )}
      >
        {displayStatus === "pending" && (
          <>
            Pending
            <ClockIcon className="ml-1 w-4 text-gray-500" />
          </>
        )}
        {displayStatus === "paid" && (
          <>
            Paid
            <CheckIcon className="ml-1 w-4 text-white" />
          </>
        )}
        {displayStatus === "overdue" && (
          <>
            Overdue
            <ClockIcon className="ml-1 w-4 text-red-500" />
          </>
        )}
        {displayStatus === "canceled" && (
          <>
            Canceled
            <ExclamationCircleIcon className="ml-1 w-4 text-violet-500" />
          </>
        )}
        <ChevronDownIcon className="ml-2 w-4" />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          {invoiceStatuses
            .filter((s) => s !== status)
            .map((s) => (
              <li
                key={s}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  startTransition(() => handleStatusUpdate(s));
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
