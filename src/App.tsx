import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Layout from "./Layout";
import { SignupForm } from "./components/SignupForm";
import { LoginForm } from "./components/LoginForm";
import { ForgotPassword } from "./components/ForgotPassword";
import { DevTools } from "./components/ReactQueryDevtools";
import { Toaster } from "sonner";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster richColors position="bottom-right" closeButton />

        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/inventory" element={<Layout />} />
          <Route path="/inventory/add" element={<Layout />} />
          <Route path="/inventory/:id" element={<Layout />} />
          <Route path="/inventory/:id/edit" element={<Layout />} />
          <Route path="/orders/purchase" element={<Layout />} />
          <Route path="/orders/sales" element={<Layout />} />
          <Route path="/orders/purchase/create" element={<Layout />} />
          <Route path="/orders/sales/create" element={<Layout />} />
          <Route path="/orders/purchase/:id" element={<Layout />} />
          <Route path="/orders/sales/:id" element={<Layout />} />
          <Route path="/orders/purchase/:id/edit" element={<Layout />} />
          <Route path="/orders/sales/:id/edit" element={<Layout />} />
          <Route path="/reports" element={<Layout />} />
          <Route path="/notifications" element={<Layout />} />
        </Routes>
      </BrowserRouter>
      <DevTools />
    </QueryClientProvider>
  );
};

export default App;
