import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Страница не найдена</h2>
      <p className="text-muted mb-4">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        На главную
      </Link>
    </div>
  );
}
