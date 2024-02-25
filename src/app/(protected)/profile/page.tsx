import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerUser } from "@/lib/nextauth";

const ProfilePage = async () => {
  const user = await getServerUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate rounded-md bg-muted p-1 font-mono text-xs">{user?.id}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate rounded-md bg-muted p-1 font-mono text-xs">{user?.name}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate rounded-md bg-muted p-1 font-mono text-xs">{user?.email}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate rounded-md bg-muted p-1 font-mono text-xs">{user?.role}</p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>{user?.isTwoFactorEnabled ? "ON" : "OFF"}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
