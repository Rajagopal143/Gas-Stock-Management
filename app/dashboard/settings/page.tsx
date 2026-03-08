import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">Settings</h2>
      <p className="text-sm text-gray-600">Configure admin credentials in environment variables:</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
        <li>ADMIN_USERNAME</li>
        <li>ADMIN_PASSWORD_HASH (bcrypt hash)</li>
        <li>MONGODB_URI</li>
        <li>JWT_SECRET</li>
      </ul>
      <p className="mt-3 text-sm">Optional feature: send WhatsApp receipt after delivery using an external provider webhook.</p>
    </Card>
  );
}
