import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { ideasService } from '../services';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: myIdeas } = useQuery({
    queryKey: ['myIdeas'],
    queryFn: () => ideasService.getMyIdeas(1, 10),
  });

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <div className="mb-3">
              <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold fs-2">
                {user?.firstName?.[0] || user?.email[0]}
              </div>
            </div>
            <h4>
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-muted">{user?.email}</p>

            <div className="d-flex justify-content-around mb-3">
              <div>
                <div className="fw-bold">{myIdeas?.total || 0}</div>
                <small className="text-muted">Идей</small>
              </div>
              <div>
                <div className="fw-bold">{user?.reputation || 0}</div>
                <small className="text-muted">Репутация</small>
              </div>
            </div>

            {user?.bio && (
              <p className="text-start">{user.bio}</p>
            )}

            {user?.skills && user.skills.length > 0 && (
              <div className="text-start">
                <strong>Навыки:</strong>
                <div className="mt-2">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge bg-light text-dark me-1 mb-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Мои идеи</h5>
          </div>
          <div className="card-body">
            {myIdeas?.data.length === 0 ? (
              <p className="text-muted text-center">
                У вас пока нет идей. Создайте первую!
              </p>
            ) : (
              <div className="list-group list-group-flush">
                {myIdeas?.data.map((idea) => (
                  <a
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{idea.title}</h6>
                        <small className="text-muted">
                          {formatDistanceToNow(idea.createdAt)}
                        </small>
                      </div>
                      <div>
                        <span className="badge bg-primary me-2">
                          ⭐ {idea.averageRating.toFixed(1)}
                        </span>
                        <span className="badge bg-secondary">
                          👁 {idea.viewsCount}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
