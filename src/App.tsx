import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Layout from "./Layout";
import { SignupForm } from "./components/SignupForm";
import { DevTools } from "./components/ReactQueryDevtools";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/inventory" element={<Layout />} />
          <Route path="/sales" element={<Layout />} />
          <Route path="/purchases" element={<Layout />} />
          <Route path="/reports" element={<Layout />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
      <DevTools />
    </QueryClientProvider>
  );
};

export default App;
