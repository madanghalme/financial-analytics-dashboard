# Financial Analytics Dashboard

A production-style full-stack financial analytics dashboard built for the supplied assignment.

## Stack

- Frontend: React + TypeScript + Vite
- UI: custom responsive CSS
- Charts: Recharts
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Authentication: JWT
- CSV: `csv-stringify`
- Validation: Zod
- Security: Helmet, CORS, bcrypt, rate limiting

## Assignment coverage

- JWT login/logout
- Protected REST API endpoints
- Revenue vs expenses trend
- Category breakdown
- Summary metrics
- Responsive paginated transaction table
- Real-time search
- Multi-field filtering: date, amount, category, status, user
- Column sorting with indicators
- Alert chips for API/errors
- Configurable CSV export
- Browser download
- MongoDB seed script using the supplied transaction data
- API documentation
- Docker Compose for MongoDB
- Loading, empty, error and unauthorized states

The assignment specifies React/TypeScript, Node/TypeScript, MongoDB, JWT and CSV generation, all of which are implemented here. fileciteturn1file0L50-L60

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB 7+ locally, OR Docker Desktop

## 1. Start MongoDB

### Docker

```bash
docker compose up -d mongo
```

### Or local MongoDB

Run MongoDB normally and keep the default connection at:

`mongodb://127.0.0.1:27017/financial_analytics`

## 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

## 3. Frontend

Open another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Demo login

```text
Email: analyst@example.com
Password: Password@123
```

The demo account is created by the seed script. You can change the credentials through `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in the backend `.env`.

## Production build

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## API

See [docs/API.md](docs/API.md).

## Project structure

```text
financial-analytics-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   └── ...
│   ├── .env.example
│   └── package.json
├── data/
│   └── transactions.json
├── docs/
│   └── API.md
├── docker-compose.yml
└── README.md
```

## Notes

The provided brief references a Figma link, but the supplied PDF contains only the text `Link: here`, without a usable Figma URL. Therefore the UI uses a clean analyst-focused design while implementing the written requirements rather than inventing a Figma specification. fileciteturn1file0L26-L33

The supplied dataset contains transaction fields `id`, `date`, `amount`, `category`, `status`, `user_id`, and `user_profile`;


## UI reference

The dashboard UI was updated to follow the supplied Penta reference screenshot: dark charcoal sidebar, compact top navigation, green/yellow financial palette, four metric cards, Overview line chart, Recent Transaction panel, and the large Transactions ledger with search, date range, status pills and pagination. The screenshot is treated as the visual source of truth for the dashboard presentation while the written assignment remains the source of truth for functionality.
