import {
  BookOpen,
  Check,
  Code2,
  HelpCircle,
  Home as HomeIcon,
  Map,
} from "lucide-react";
import {
  HashRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { ProgressProvider, useProgress } from "../engine/persistence";
import { Brand } from "../components/common";
import { Home } from "../pages/Home";
import { Curriculum } from "../pages/Curriculum";
import { LessonPage } from "../pages/Lesson";
const Workspace = lazy(() =>
  import("../pages/Workspace").then((module) => ({
    default: module.Workspace,
  })),
);
import { Project } from "../pages/Project";
import { Settings } from "../pages/Settings";
function Layout() {
  const { status, ready } = useProgress();
  const location = useLocation();
  const workspace =
    location.pathname.startsWith("/workspace") ||
    location.pathname === "/editor";
  const lesson = location.pathname.startsWith("/lesson");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="shell">
      <header className="app-header">
        <Brand />
        <nav aria-label="Основная навигация">
          <NavLink to="/" end>
            <HomeIcon size={16} />
            <span>Курс JavaScript</span>
          </NavLink>
          <NavLink to="/curriculum">
            <Map size={16} />
            <span>Программа</span>
          </NavLink>
          <NavLink to="/project">
            <Code2 size={16} />
            <span>Мой проект</span>
          </NavLink>
          <a
            href={import.meta.env.BASE_URL + "nova/index.html"}
            target="_blank"
            rel="noopener noreferrer"
            className="nova-external-link"
            aria-label="Открыть сайт NOVA в отдельной вкладке"
          >
            <span>Сайт</span> NOVA ↗
          </a>
        </nav>
        <span className="save-status">
          <span className="save-dot" />
          {status}
        </span>
        <NavLink
          className="help-link"
          to="/settings"
          aria-label="Данные и помощь"
        >
          <HelpCircle size={20} />
        </NavLink>
      </header>
      {!workspace && !lesson && (
        <aside className="app-sidebar">
          <p className="eyebrow">ОБРАЗОВАНИЕ В ДЕЙСТВИИ</p>
          <NavLink end to="/">
            <BookOpen size={18} />
            Мой курс
          </NavLink>
          <NavLink to="/curriculum">
            <Map size={18} />
            Программа
          </NavLink>
          <NavLink to="/project">
            <Code2 size={18} />
            Мой проект NOVA
          </NavLink>
          <NavLink to="/settings">
            <HelpCircle size={18} />
            Данные и помощь
          </NavLink>
          <div className="sidebar-footer">
            <div className="sidebar-corner" />
            <p>
              От идеи
              <br />к работающему коду.
            </p>
            <small>TOP / JAVASCRIPT ACADEMY</small>
          </div>
        </aside>
      )}
      <div className={!workspace && !lesson ? "app-content" : ""}>
        {ready ? (
          <Suspense
            fallback={<div className="loading-page">Открываем редактор…</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/workspace/:id" element={<Workspace />} />
              <Route path="/editor" element={<Workspace free />} />
              <Route path="/project" element={<Project />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="*"
                element={
                  <main className="standard-page">
                    <h1>Страница не найдена</h1>
                    <NavLink to="/">Вернуться к курсу</NavLink>
                  </main>
                }
              />
            </Routes>
          </Suspense>
        ) : (
          <div className="loading-page">
            <Check size={25} />
            Загружаем учебное пространство…
          </div>
        )}
      </div>
    </div>
  );
}
export function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <Layout />
      </ProgressProvider>
    </HashRouter>
  );
}
