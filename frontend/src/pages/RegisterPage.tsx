import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast.success('Регистрация успешна');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Регистрация</h2>

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

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Имя
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
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
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              <div className="text-center">
                <span className="text-muted">Уже есть аккаунт? </span>
                <Link to="/login">Войти</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
