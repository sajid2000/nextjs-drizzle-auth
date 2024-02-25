"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { logoutAction } from "@/app/auth/_actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AUTH_URI } from "@/lib/constants";

const UserMenu = () => {
  const router = useRouter();
  const session = useSession();

  if (!session) return null;

  const user = session.data?.user;

  const logout = async () => {
    await logoutAction();

    router.replace(AUTH_URI.signIn);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <UserIcon className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <span role="button" onClick={logout}>
          <DropdownMenuItem>
            <ExitIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </span>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
