Rails.application.routes.draw do
  post 'signup/admin',     to: 'auth#signup_admin'
  post 'signup/librarian', to: 'auth#signup_librarian'
  post 'signup/member',    to: 'auth#signup_member'
  post 'login',            to: 'auth#login'

  get 'admin/dashboard',      to: 'admin#dashboard'
  get 'librarian/dashboard',  to: 'librarian#dashboard'
  get 'member/dashboard',     to: 'member#dashboard'
end
