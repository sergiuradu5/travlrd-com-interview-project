import { INVOICE_OVERDUE_AFTER_DAYS } from "@/app/lib/constants";
import { InvoiceStatusType } from "@/app/lib/definitions";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function InvoiceStatus({
  status,
  date,
}: {
  status: InvoiceStatusType;
  date: Date;
}) {
  const today = new Date();
  const twoWeeksAgo = new Date(
    today.getTime() - INVOICE_OVERDUE_AFTER_DAYS * 24 * 60 * 60 * 1000
  );

  const displayStatus: InvoiceStatusType | "overdue" =
    status === "pending" && new Date(date) < twoWeeksAgo ? "overdue" : status;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-red-500": displayStatus === "overdue",
          "bg-gray-100 text-gray-500": displayStatus === "pending",
          "bg-green-500 text-white": displayStatus === "paid",
        }
      )}
    >
      {displayStatus === "pending" ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {displayStatus === "paid" ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {displayStatus === "overdue" ? (
        <>
          Overdue
          <ClockIcon className="ml-1 w-4 text-red-500" />
        </>
      ) : null}
    </span>
  );
}
