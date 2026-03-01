import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Вы успешно вышли');
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <header className="bg-white shadow-sm sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to="/">
              💡 IdeaTracker
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Лента идей
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/create-idea">
                        Создать идею
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        Профиль
                      </Link>
                      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            Мой профиль
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/investor-profile">
                            Инвестор
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>

              <div className="d-flex align-items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <span className="text-muted">
                      {user?.firstName || user?.email}
                    </span>
                    <button className="btn btn-outline-secondary" onClick={handleLogout}>
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="btn btn-outline-primary" to="/login">
                      Войти
                    </Link>
                    <Link className="btn btn-primary" to="/register">
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">© 2026 IdeaTracker. Платформа для краудсорсинга идей</p>
        </div>
      </footer>
    </div>
  );
}
