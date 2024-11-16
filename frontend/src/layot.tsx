import { Header } from "./components/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { useCurrentLocation } from "./hooks/global/useCurrentLocation";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Layout(props: PropsWithChildren) {
  const isAuth = useCurrentLocation();
  return (
    <QueryClientProvider client={client}>
      <section className="layout">
        {!isAuth ? <Header /> : <div></div>}
        <section className="page-main">{props.children}</section>
      </section>
      <Toaster
        position="top-center"
        closeButton={true}
        richColors={true}
        gap={8}
        toastOptions={{ duration: 3000 }}
      />
    </QueryClientProvider>
  );
}

export default Layout;
