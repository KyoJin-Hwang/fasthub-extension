import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // WHY 5분? API 절약
      gcTime: 30 * 60 * 1000, // WHY 30분? 메모리 효율
      refetchOnWindowFocus: true,
      retry: 1, // WHY 1? 빠른 실패 (확장프로그램)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </QueryClientProvider>
  </JotaiProvider>
);
