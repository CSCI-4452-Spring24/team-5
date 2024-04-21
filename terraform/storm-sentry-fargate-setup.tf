terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "my_cluster" {
  name = "Storm-Sentry-Cluster"
}
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::992382410602:role/ecsTaskExecutionRole"
}


# ECS Task Definition
resource "aws_ecs_task_definition" "my_task" {
  family                   = "handler-task-1"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend-handler"
      image     = "992382410602.dkr.ecr.us-east-1.amazonaws.com/stormsentry-backend:0.0.0-prerelease0"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
    }
  ])
   
}

# ECS Service
resource "aws_ecs_service" "my_service" {
  name            = "terraform-service-1"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [
      "subnet-062467a95347168a6",  # us-east-1e
      "subnet-0d494539ffa16292c",  # us-east-1a
      "subnet-0708191da39bd1030",  # us-east-1b
      "subnet-0c7099e23eca5bb47",  # us-east-1d
      "subnet-027a41e67562e8451",  # us-east-1f
      "subnet-0abf76f40c356d3bd"   # us-east-1c
    ]
    security_groups = [
      "sg-013c3bd7eb5a08cee",  # Default
      "sg-0ec5b69bdbd3c46e3",  # ECS-http-https-inbound
      "sg-03ccccba527020e3c"   # p80
    ]
    assign_public_ip = true
  }
}

# Note: Ensure that the security group settings allow for the proper ingress and egress traffic as needed by your application.
