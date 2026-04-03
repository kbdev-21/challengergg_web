import {Routes, Route, Link, BrowserRouter, Navigate} from "react-router-dom";
import PageLayout from "./components/layout/PageLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChampionsPage from "./pages/ChampionsPage.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GlobalProvider} from "./contexts/GlobalContext.jsx";
import ChampionPage from "./pages/ChampionPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ItemManagerPage from "./pages/ItemManagerPage.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <BrowserRouter>
          <PageLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:region/:nameAndTag/:subMenu" element={<ProfilePage />} />
              <Route path="/champions" element={<ChampionsPage />} />
              <Route path="/champions/:championName/:position?" element={<ChampionPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/chat/:room?" element={<ChatPage />} />
              <Route path="/admin/items" element={<ItemManagerPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageLayout>
        </BrowserRouter>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
