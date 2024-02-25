"use client";

import FormError from "@/components/FormError";
import { useCurrentRole } from "@/hooks/use-current-role";
import { roleEnum } from "@/lib/db/schema";

interface Props {
  children: React.ReactNode;
  allowedRole: (typeof roleEnum.enumValues)[number];
}

const RoleGate = ({ children, allowedRole }: Props) => {
  const role = useCurrentRole() as any;

  if (role !== allowedRole) {
    return <FormError message="You do not have permission to view this content!" />;
  }

  return children;
};

export default RoleGate;
