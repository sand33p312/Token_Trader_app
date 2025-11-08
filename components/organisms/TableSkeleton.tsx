// This is an "organism" component for loading states
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">Token</TableHead>
        <TableHead className="text-right">Price</TableHead>
        <TableHead className="text-right">24h %</TableHead>
        <TableHead className="text-right">TVL</TableHead>
        <TableHead className="text-right">24h Volume</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, t) => (
        <TableRow key={t}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);