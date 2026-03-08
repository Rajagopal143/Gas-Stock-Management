import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">Reports</h2>
      <ul className="list-disc pl-5">
        <li>Daily Sales</li>
        <li>Monthly Sales</li>
        <li>Customer Sales</li>
        <li>Cylinder Sales</li>
      </ul>
      <a href="/api/reports/csv" className="mt-4 inline-block rounded bg-secondary px-4 py-2 text-white">Download CSV</a>
    </Card>
  );
}
