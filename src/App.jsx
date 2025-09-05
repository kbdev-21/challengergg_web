import {Routes, Route, Link, BrowserRouter} from "react-router-dom";
import PageLayout from "./components/PageLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChampionsPage from "./pages/ChampionsPage.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GlobalProvider} from "./contexts/GlobalContext.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <BrowserRouter>
          <PageLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profiles/:region/:nameAndTag" element={<ProfilePage />} />
              <Route path="/champions" element={<ChampionsPage />} />
            </Routes>
          </PageLayout>
        </BrowserRouter>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
