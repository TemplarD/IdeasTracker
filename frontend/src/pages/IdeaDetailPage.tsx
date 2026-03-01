import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ideasService, ratingsService, commentsService } from '../services';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState({ interest: 5, benefit: 5, profitability: 5 });
  const [commentText, setCommentText] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  const { data: idea, isLoading: ideaLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => ideasService.getById(id!),
    enabled: !!id,
  });

  const { data: myRating } = useQuery({
    queryKey: ['myRating', id],
    queryFn: () => ratingsService.getMyRating(id!),
    enabled: !!id && isAuthenticated,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsService.getByIdea(id!),
    enabled: !!id,
  });

  const rateMutation = useMutation({
    mutationFn: (data: any) =>
      myRating
        ? ratingsService.update(id!, data)
        : ratingsService.create(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', id] });
      queryClient.invalidateQueries({ queryKey: ['myRating', id] });
      toast.success('Оценка сохранена');
      setShowRatingForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка оценки');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      commentsService.create(id!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      queryClient.invalidateQueries({ queryKey: ['idea', id] });
      toast.success('Комментарий добавлен');
      setCommentText('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка комментария');
    },
  });

  const handleRatingSubmit = () => {
    rateMutation.mutate(rating);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  if (ideaLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="alert alert-danger">Идея не найдена</div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8">
        {/* Idea Header */}
        <div className="card mb-4">
          <div className="card-body">
            <h1 className="mb-3">{idea.title}</h1>

            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-primary">
                ⭐ {idea.averageRating.toFixed(1)}
              </span>
              <span className="badge bg-secondary">👁 {idea.viewsCount}</span>
              {idea.tags.map((tag: string) => (
                <span key={tag} className="badge bg-light text-dark">
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-muted mb-3">
              <small>
                Опубликовано {formatDistanceToNow(idea.createdAt)}
              </small>
            </div>

            <div className="mb-3">
              {idea.presentationUrl && (
                <a
                  href={idea.presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  📄 Презентация
                </a>
              )}
            </div>

            <div className="idea-description">
              <h4>Описание</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{idea.description}</p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="card">
          <div className="card-body">
            <h4 className="mb-4">Комментарии ({comments?.length || 0})</h4>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Напишите комментарий..."
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={commentMutation.isPending}
                >
                  {commentMutation.isPending ? 'Отправка...' : 'Отправить'}
                </button>
              </form>
            ) : (
              <div className="alert alert-info">
                <a href="/login">Войдите</a>, чтобы оставить комментарий
              </div>
            )}

            <div className="comments-list">
              {comments?.map((comment) => (
                <div key={comment.id} className="card mb-2">
                  <div className="card-body">
                    <p className="mb-2">{comment.content}</p>
                    <small className="text-muted">
                      {formatDistanceToNow(comment.createdAt)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-lg-4">
        {/* Rating */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Оценить идею</h5>

            {isAuthenticated ? (
              myRating ? (
                <div>
                  <p className="text-success mb-2">
                    ✓ Вы уже оценили эту идею
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowRatingForm(!showRatingForm)}
                  >
                    Изменить оценку
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={() => setShowRatingForm(!showRatingForm)}
                  >
                    {showRatingForm ? 'Закрыть' : 'Оценить'}
                  </button>

                  {showRatingForm && (
                    <div>
                      <div className="mb-3">
                        <label className="form-label">Интерес</label>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="5"
                          value={rating.interest}
                          onChange={(e) =>
                            setRating({ ...rating, interest: +e.target.value })
                          }
                        />
                        <div className="text-center">{rating.interest}/5</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Польза</label>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="5"
                          value={rating.benefit}
                          onChange={(e) =>
                            setRating({ ...rating, benefit: +e.target.value })
                          }
                        />
                        <div className="text-center">{rating.benefit}/5</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Прибыльность</label>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="5"
                          value={rating.profitability}
                          onChange={(e) =>
                            setRating({
                              ...rating,
                              profitability: +e.target.value,
                            })
                          }
                        />
                        <div className="text-center">
                          {rating.profitability}/5
                        </div>
                      </div>

                      <button
                        className="btn btn-success w-100"
                        onClick={handleRatingSubmit}
                        disabled={rateMutation.isPending}
                      >
                        {rateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="alert alert-info">
                <a href="/login">Войдите</a>, чтобы оценить идею
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="card-body">
            <h5 className="mb-3">Статистика</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Интерес:</span>
              <strong>{idea.averageRating.toFixed(1)}/5</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Просмотров:</span>
              <strong>{idea.viewsCount}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Комментариев:</span>
              <strong>{comments?.length || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
