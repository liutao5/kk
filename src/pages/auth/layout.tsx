import GuestGuard from "@/auth/GuestGuard";
import { ChildrenParams } from "@/types/common";

export default function LoginLayout({ children }: ChildrenParams) {
  return <GuestGuard>{children}</GuestGuard>;
}
