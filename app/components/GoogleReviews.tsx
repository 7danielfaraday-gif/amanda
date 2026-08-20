"use client";

import { useEffect, useState } from "react";

type Review = { author: string; text: string; rating: number };

const fallbackReviews: Review[] = [
  { author: "Cliente Amanda", text: "Um cuidado preciso, acolhedor e que realmente mudou a forma como eu sentia meu corpo.", rating: 5 },
  { author: "Cliente Amanda", text: "Saí mais leve e com uma sensação de espaço no corpo que eu estava precisando há muito tempo.", rating: 5 },
];

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/reviews")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("reviews unavailable"))))
      .then((data: { reviews?: Review[]; configured?: boolean }) => {
        if (active && data.configured && data.reviews?.length) {
          setReviews(data.reviews);
          setSynced(true);
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return (
    <div className="google-reviews">
      <div className="google-status">{synced ? "Avaliações atualizadas pelo Google" : "Avaliações de clientes"}</div>
      <div className="review-cards">
        {reviews.slice(0, 2).map((review, index) => (
          <article className="review-card" key={`${review.author}-${index}`}>
            <div className="review-stars" aria-label={`${review.rating} de 5 estrelas`}>{"★".repeat(review.rating)}</div>
            <blockquote>“{review.text}”</blockquote>
            <cite>{review.author}</cite>
          </article>
        ))}
      </div>
      <p className="review-source-note">
        A sincronização automática está pronta para conectar ao Perfil da Empresa no Google. Enquanto isso, você pode conferir todas as avaliações diretamente no <a href="https://www.google.com/maps/search/?api=1&query=Amanda+Bergamasco+Massoterapia" target="_blank" rel="noreferrer">Google</a>.
      </p>
    </div>
  );
}
