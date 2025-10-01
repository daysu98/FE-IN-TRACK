import { cn } from "../library/utils";

export const Table = ({ className = "", children }) => {
  return (
    <table className={cn("table-auto md:table-fixed w-full bg-white", className)}>
      {children}
    </table>
  );
};
export const Thead = ({ className = "", children }) => {
  return <thead className={cn("bg-white", className)}>{children}</thead>;
};
export const Tr = ({ className = "", children }) => {
  return <tr className={cn("text-black", className)}>{children}</tr>;
};
export const Th = ({ className = "", children }) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  );
};
export const Tbdy = ({ className = "", children }) => {
  return (
    <tbody className={cn("bg-blue-50 divide-y divide-gray-200", className)}>
      {children}
    </tbody>
  );
};
export const Td = ({ className = "", children }) => {
  return (
    <td
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-700",
        className
      )}
    >
      {children}
    </td>
  );
};
