import { useState } from 'react';

const CARD_STYLE = {
  width: 180,
  minHeight: 320,
  background: '#e8f5e9',
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
  background: '#c8e6c9',
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
  const [editHover, setEditHover] = useState(null);
  const [deleteHover, setDeleteHover] = useState(null);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
                  <button style={{padding:'0.5rem 0.5rem'}} onClick={() => onBorrow(book.id)}>Borrow</button>
                )}
                {canEdit && (
                  <button
                    style={{
                      height: 32,
                      minWidth: 84,
                      cursor: 'pointer',
                      borderRadius: 8,
                      background: 'rgba(56, 142, 60, 0.12)', // glassy green
                      textAlign: 'center',
                      lineHeight: '32px',
                      border: 'none',
                      color: '#388e3c', // green text
                      fontFamily: 'Segoe UI, Arial, sans-serif',
                      fontWeight: 400, // lighter than 600
                      fontSize: 15,
                      transition: 'background 0.2s, color 0.2s',
                      padding: '0 18px',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(56, 142, 60, 0.20)';
                      e.currentTarget.style.color = '#256029';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(56, 142, 60, 0.12)';
                      e.currentTarget.style.color = '#388e3c';
                    }}
                    onClick={() => onEdit(book)}
                  >
                    <span style={{ color: '#388e3c', fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 400 }}>Edit</span>
                  </button>
                )}
                {canDelete && (
                  <button
                    style={{
                      height: 32,
                      minWidth: 84,
                      cursor: 'pointer',
                      borderRadius: 8,
                      background: 'rgba(183, 28, 28, 0.12)', // glassy red
                      textAlign: 'center',
                      lineHeight: '32px',
                      border: 'none',
                      color: '#b71c1c', // red text
                      fontFamily: 'Segoe UI, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 15,
                      transition: 'background 0.2s, color 0.2s',
                      padding: '0 18px',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(183, 28, 28, 0.20)';
                      e.currentTarget.style.color = '#7f1010';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(183, 28, 28, 0.12)';
                      e.currentTarget.style.color = '#b71c1c';
                    }}
                    onClick={() => onDelete(book.id)}
                  >
                    <span style={{ color: '#b71c1c', fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 400 }}>Delete</span>
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