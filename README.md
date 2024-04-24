## Cloud Computing Project - Team 5
 
## Overview This repository contains the work for Team 5's project in CSCI-4452 (Cloud Computing course), Spring 2024. 

Our project focuses on building a scalable cloud-based (Android only for now) weather application using a RESTful API handler and Terraform/Docker for automating infrastructure and setup. In addition to the front and backends, the project currently utilizes an Nginx reverse proxy to perform filtering and forwarding on behalf of the client and api handler. 

## Technologies Used - 
**Frontend:** JavaScript - 
**Backend:** Python - 
**Infrastructure:** Terraform, Docker - 
**Other:** Kotlin, Shell Scripts 

## Project Structure - `.github/workflows`: Contains GitHub Actions for CI/CD. 
- `Backend`: Backend application code.
- `Frontend`: Frontend UI code.
- `terraform`: Infrastructure as code for cloud deployment.
  
## Getting Started The project is designed for hosting Backend/ on an AWS Fargate task. However, to get a local copy of the RESTful API handler up and running, follow these simple steps: 

### Prerequisites 
- Install Docker on your system.
  
### Installation 
  1. Clone the repo: git clone https://github.com/CSCI-4452-Spring24/team-5.git
