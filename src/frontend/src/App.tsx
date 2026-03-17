import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Listing } from "./backend.d";
import BottomNav from "./components/BottomNav";
import AddListingScreen from "./screens/AddListingScreen";
import DetailScreen from "./screens/DetailScreen";
import EditListingScreen from "./screens/EditListingScreen";
import HomeScreen from "./screens/HomeScreen";
import ListingsScreen from "./screens/ListingsScreen";
import MyListingsScreen from "./screens/MyListingsScreen";
import SplashScreen from "./screens/SplashScreen";

const queryClient = new QueryClient();

export type ScreenName =
  | "splash"
  | "home"
  | "listings"
  | "detail"
  | "add"
  | "edit"
  | "myListings";

export type NavState =
  | { name: "splash" }
  | { name: "home" }
  | { name: "listings"; category?: string; search?: string }
  | { name: "detail"; listingId: bigint }
  | { name: "add" }
  | { name: "edit"; listing: Listing }
  | { name: "myListings" };

export type NavigateFn = (state: NavState) => void;

function AppContent() {
  const [navStack, setNavStack] = useState<NavState[]>([{ name: "splash" }]);
  const current = navStack[navStack.length - 1];

  const navigate: NavigateFn = (state: NavState) => {
    setNavStack((prev) => [...prev, state]);
  };

  const goBack = () => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const navigateReplace = (state: NavState) => {
    setNavStack([state]);
  };

  const showNav = current.name !== "splash" && current.name !== "detail";

  return (
    <div className="mobile-container overflow-hidden">
      <div className="screen-enter" key={current.name}>
        {current.name === "splash" && (
          <SplashScreen onFinish={() => navigateReplace({ name: "home" })} />
        )}
        {current.name === "home" && <HomeScreen navigate={navigate} />}
        {current.name === "listings" && (
          <ListingsScreen
            navigate={navigate}
            initialCategory={current.category}
            initialSearch={current.search}
          />
        )}
        {current.name === "detail" && (
          <DetailScreen listingId={current.listingId} goBack={goBack} />
        )}
        {current.name === "add" && (
          <AddListingScreen navigate={navigate} goBack={goBack} />
        )}
        {current.name === "edit" && (
          <EditListingScreen
            listing={current.listing}
            navigate={navigate}
            goBack={goBack}
          />
        )}
        {current.name === "myListings" && (
          <MyListingsScreen navigate={navigate} />
        )}
      </div>
      {showNav && (
        <BottomNav
          current={current.name as ScreenName}
          navigate={navigateReplace}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
