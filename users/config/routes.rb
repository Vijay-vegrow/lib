Rails.application.routes.draw do
  post 'signup/admin',     to: 'auth#signup_admin'
  post 'signup/librarian', to: 'auth#signup_librarian'
  post 'signup/member',    to: 'auth#signup_member'
  post 'login',            to: 'auth#login'
  post '/api/assign_role', to: 'sessions#assign_role'
  get 'admin/dashboard',      to: 'admin#dashboard'
  post 'admin/add_admin',     to: 'admin#add_admin'
  get 'admin/pending_librarians', to: 'admin#pending_librarians'
  post 'admin/approve_librarian', to: 'admin#approve_librarian'
  get 'admin/approved_librarians', to: 'admin#approved_librarians'
  delete '/admin/librarians/:id', to: 'admin#destroy_librarian'
  get '/admin/users', to: 'admin#users'
  delete '/admin/users/:id', to: 'admin#destroy_user'

  get 'librarian/dashboard',  to: 'librarian#dashboard'
  get 'member/dashboard',     to: 'member#dashboard'

  resources :books, only: [:index, :show, :create, :update, :destroy]
  resources :borrowings, only: [:index, :create]
  post 'borrowings/:id/return', to: 'borrowings#return_book'
  post 'borrowings/:id/approve_return', to: 'borrowings#approve_return'
  get 'borrowings/pending_returns', to: 'borrowings#pending_returns'
  post '/auth/google_oauth2_token', to: 'auth#google_oauth2_token'

  get '/stats/summary', to: 'stats#summary'
  get '/stats/borrow_trends', to: 'stats#borrow_trends'
  get '/stats/hot_books', to: 'stats#hot_books'
end
