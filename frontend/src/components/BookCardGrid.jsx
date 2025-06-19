import { useState } from 'react';

const CARD_STYLE = {
  width: 180,
  minHeight: 320,
  background: '#e8f5e9', // Soft green background
  borderRadius: 14,
  boxShadow: '0 2px 12px rgba(56,142,60,0.10)',
  margin: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
  cursor: 'pointer',
  position: 'relative',
};

const CARD_HOVER_STYLE = {
  background: '#c8e6c9', // Slightly darker green on hover
  transform: 'translateY(-12px) scale(1.04)',
  boxShadow: '0 8px 24px rgba(56,142,60,0.18)',
};

const IMAGE_STYLE = {
  width: 120,
  height: 160,
  objectFit: 'cover',
  borderRadius: 8,
  marginBottom: 12,
  background: '#f0f0f0',
};

const DEFAULT_IMAGE = "https://www.omnibookslibrary.com/app/admin/images/books/1654677967.jpg";

export default function BookCardGrid({
  books = [],
  onBorrow,
  onEdit,
  onDelete,
  canBorrow,
  canEdit,
  canDelete,
  showActions = true,
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          justifyContent: 'flex-start',
          minHeight: 200,
        }}
      >
        {(books || []).map((book, idx) => (
          <div
            key={book.id}
            style={{
              ...CARD_STYLE,
              ...(hovered === idx ? CARD_HOVER_STYLE : {}),
            }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={book.image_url && book.image_url.trim() !== "" ? book.image_url : DEFAULT_IMAGE}
              alt={book.title}
              style={IMAGE_STYLE}
              onError={e => { e.target.src = DEFAULT_IMAGE; }}
            />
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, textAlign: 'center', color: '#234c2e' }}>{book.title}</div>
            <div style={{ fontSize: 14, color: '#388e3c', marginBottom: 4 }}>{book.author}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>{book.publication_year} &middot; {book.publisher}</div>
            <div style={{ fontSize: 13, color: '#388e3c', marginBottom: 8 }}>
              Available: {book.availability_count}
            </div>
            {showActions && (
              <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                {canBorrow && book.availability_count > 0 && (
                  <button
                    style={{
                      background: '#a5d6a7',
                      color: '#234c2e',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 16px',
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => onBorrow(book.id)}
                  >
                    Borrow
                  </button>
                )}
                {canEdit && (
                  <button
                    style={{
                      background: '#fff59d',
                      color: '#795548',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => onEdit(book)}
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    style={{
                      background: '#ef9a9a',
                      color: '#b71c1c',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => onDelete(book.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}