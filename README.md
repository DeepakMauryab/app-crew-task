# Notes App (React Native + Supabase)

A simple Notes application built using **React Native** and **Supabase**, supporting authentication and CRUD operations for user-specific notes.

---

## 📦 Project Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/DeepakMauryab/app-crew-task
cd app-crew-task
```

npm install

# or

yarn install

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

npm start

# or

yarn start

npm run android

Supabase Schema Details
Table: notes

| Field Name   | Type      | Description                       |
| ------------ | --------- | --------------------------------- |
| `id`         | uuid (PK) | Unique identifier for the note    |
| `user_id`    | uuid (FK) | References `auth.users.id`        |
| `title`      | text      | Title of the note                 |
| `content`    | text      | Note content                      |
| `created_at` | timestamp | Auto-generated creation timestamp |

auth.uid() = user_id

Supabase Authentication with Email & Password

Authentication handled using supabase.auth

User session persists automatically

On logout:

supabase.auth.signOut() is called

Navigation stack is reset to Login screen
