# Newsfeed Application

A full-stack newsfeed application built around a GraphQL API. Users can create, edit, delete, like, and unlike posts while browsing a reverse-chronological feed with cursor-based pagination.

## Features

- Create, edit, and delete posts
- Like and unlike posts
- Display posts in reverse chronological order
- Load additional posts using cursor-based pagination
- Prevent duplicate likes at the database level
- Handle like updates transactionally to keep server state consistent
- Persist posts and likes with SQLite
- Communicate between the frontend and backend through GraphQL

## Tech Stack

**Frontend:** Next.js, React, TypeScript  
**Backend:** Python, Django, Strawberry GraphQL  
**Database:** SQLite

## Architecture

The application separates the frontend, GraphQL API, and database into distinct layers. The Next.js frontend sends GraphQL queries and mutations to a Django backend, which manages post and like state through Django's ORM.

Feed pagination uses a cursor derived from each post's creation timestamp and ID. This allows the server to return posts in reverse chronological order while avoiding duplicate or missing entries when the feed changes between requests.

Like and unlike operations are handled inside database transactions with row-level locking so that the server remains the authoritative source of the post's like state.

![System Diagram](system_diagram.jpg)

Additional design decisions and failure-mode considerations are documented in [`rfc.md`](rfc.md).

## Running Locally

### Backend

From the `backend` directory, install the required Python dependencies:

```bash
pip install django strawberry-graphql django-cors-headers
```

Apply the database migrations and start the Django server:

```bash
python manage.py migrate
python manage.py runserver
```

The GraphQL endpoint will be available at:

```text
http://127.0.0.1:8000/graphql/
```

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```
