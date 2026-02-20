import Providers from "./provider";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Providers> {children}</Providers>
    </>
  );
}
