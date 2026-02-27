import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Вход выполнен успешно');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Вход</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              <div className="text-center">
                <span className="text-muted">Нет аккаунта? </span>
                <Link to="/register">Зарегистрироваться</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
