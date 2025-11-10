# hub

Welcome to my hub! This repository is a central point for my personal projects, experiments, and infrastructure configurations. It serves as a playground for learning new technologies, a portfolio of my work, and a platform for hosting my personal applications.

## 🏛️ System Architecture

The hub ecosystem is designed to be a scalable and resilient platform for hosting a variety of applications. The architecture is centered around Google Cloud Platform (GCP) and leverages Docker for containerization, Terraform for infrastructure as code, and GitHub Actions for CI/CD.

## 🚀 Projects

This repository contains several projects, each with its own directory and documentation. Here's a quick overview:

| Project | Description | Technologies |
| --- | --- | --- |
| [FastAPI API](./fastapi/) | A robust and scalable API built with FastAPI. It serves as the backend for the portfolio app and other projects. | Python, FastAPI, Docker |
| [Portfolio App](./portfolio_app/) | My personal portfolio website, built with Next.js. It showcases my projects, skills, and blog posts. | Next.js, React, TypeScript, Tailwind CSS |
| [Cloud Functions](./functions_img/) | A collection of serverless functions for various tasks, such as data processing and automation. | Python, R, Docker, Google Cloud Run |
| [Terraform IaC](./terraform/gcp/) | Infrastructure as Code for deploying all the necessary GCP resources, including networking, storage, and compute. | Terraform, Google Cloud Platform |
| [Grafana Dashboards](./grafana/) | Monitoring and visualization dashboards for my services, providing real-time insights into application performance and system health. | Grafana, Docker |

## 🛠️ Technologies

This project utilizes a wide range of technologies, including:

- **Backend:** Python, FastAPI, Node.js
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Data:** PostgreSQL, FireStore, BigQuery
- **DevOps:** Docker, Terraform, GitHub Actions
- **Cloud:** Google Cloud Platform (GCP)

## ☁️ Deployment

Most applications in this repository are designed to be deployed as Docker containers on Google Cloud Run. You can find detailed deployment instructions in the `readme.txt` file within each project's directory.

Here's a general example of how to deploy an application:

```bash
# Build the Docker image
docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/hub14/hub-artifact-repo/<app-name> \
  -f <app-name>.dockerfile \
  --push .

# Deploy to Google Cloud Run
gcloud run deploy <app-name>-run \
  --image=us-central1-docker.pkg.dev/hub14/hub-artifact-repo/<app-name> \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated
```

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The workflows are defined in the `.github/workflows` directory and are triggered by pushes to specific branches.

- `deploy-fastapi-api.yml`: Deploys the FastAPI application to Cloud Run when changes are pushed to the `fastapi-api` branch.
- `deploy-portfolio-app.yml`: Deploys the Next.js portfolio application to Cloud Run when changes are pushed to the `portfolio` branch.

## 💻 Usage

To run any of the projects locally, please refer to the `readme.txt` file in the corresponding project directory. Generally, you'll need to have Docker and the relevant programming language (Python, Node.js) installed.

For example, to run the portfolio app:

```bash
cd portfolio_app
npm install
npm run dev
```

## 🤝 Contributing

This is a personal project, but I'm open to suggestions and contributions. If you have any ideas or find any issues, feel free to open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
