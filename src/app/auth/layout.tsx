import ThemeToggle from "@/components/ThemeToggle";

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="flex h-full items-center justify-center bg-muted">
      <ThemeToggle className="absolute right-4 top-4 md:right-8 md:top-8" />
      {children}
    </main>
  );
};

export default AuthLayout;
