# ClothStreetSL
ClothStreet is a fashion marketplace web application that connects customers, designers, and suppliers. Users can explore clothing designs, request custom orders, manage profiles, and track order progress through an integrated dashboard.

## CI Pipeline

A GitHub Actions workflow runs automatically on every **push** and **pull request** to the `develop` branch.

### What it checks

| Job | Tool | Purpose |
|---|---|---|
| Backend | `black --check` | Python code formatting |
| Backend | `flake8` | Python linting |
| Frontend | `npm run lint` | ESLint checks |
| Frontend | `npm run build` | Ensures the React app compiles |

The pipeline **fails** if any check does not pass.

### Run checks locally

```bash
# Backend (from /backend)
pip install -r requirements.txt
black --check .
flake8 .

# Frontend (from /frontend)
npm install
npm run lint
npm run build
```
