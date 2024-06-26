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


# ECS create a new cluster Cluster
resource "aws_ecs_cluster" "my_cluster" {
  count = var.cluster_create ? 1 : 0
  name  = "--"
}

# ECS create a new Task Definition
resource "aws_ecs_task_definition" "create_task_definition" {
  count                    = var.t_def_create ? 1 : 0
  family                   = "this-is-a-place-holder"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = data.aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend-handler"
      image     = "992382410602.dkr.ecr.us-east-1.amazonaws.com/stormsentry-backend"
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

# ECS create a new task def revision
resource "aws_ecs_task_definition" "revise_task_definition" {
  count                    = var.t_def_revision ? 1 : 0
  family                   = "Handler-fargate"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"  # Total CPU for the task
  memory                   = "1024" # Total memory for the task
  execution_role_arn       = data.aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "Flask-container"
      image     = "992382410602.dkr.ecr.us-east-1.amazonaws.com/stormsentry-backend:${var.image_version_backend}"
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ],
       environment = [
      {
        name  = "GEOCODE_API_KEY"
        value = var.GEOCODE_API_KEY
      },
      {
        name  = "WEATHER_API_KEY"
        value = var.WEATHER_API_KEY
      }
    ],

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/Handler-fargate"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "flask-container"
        }
      }

    },
    {
      name      = "nginx-container"
      image     = "992382410602.dkr.ecr.us-east-1.amazonaws.com/stormsentry-nginx:${var.image_version_nginx}"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        } #,
        # {
        #  containerPort = 5000
        # hostport      = 5000
        #protocol      = "tcp"
        #}
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/Handler-fargate"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "nginx-container"
        }
      }
    }
  ])
}

locals {
  task_definition_arn = var.t_def_revision ? aws_ecs_task_definition.revise_task_definition[0].arn : data.aws_ecs_task_definition.existing_task.arn
}

# ECS Service creation
resource "aws_ecs_service" "my_service" {
  name            = "nginx_backend_current"
  cluster         = data.aws_ecs_cluster.my_cluster.id
  task_definition = local.task_definition_arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [
      "subnet-062467a95347168a6",
      "subnet-0d494539ffa16292c",
      "subnet-0708191da39bd1030",
      "subnet-0c7099e23eca5bb47",
      "subnet-027a41e67562e8451",
      "subnet-0abf76f40c356d3bd"
    ]
    security_groups = [
      "sg-013c3bd7eb5a08cee",
      "sg-0ec5b69bdbd3c46e3",
      "sg-03ccccba527020e3c"
    ]
    assign_public_ip = true
  }
}

#resource "aws_iam_role" "ecs_execution_role" {
# name = "ecsTaskExecutionRole"

#assume_role_policy = jsonencode({
# Version = "2012-10-17"
#Statement = [
# {
#  Action = "sts:AssumeRole"
# Principal = {
#  Service = "ecs-tasks.amazonaws.com"
#}
#Effect = "Allow"
#Sid    = ""
#},
#]
#})
#}

#resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
# role       = aws_iam_role.ecs_execution_role.name
#policy_arn = "arn:aws:iam::992382410602:role/ecsTaskExecutionRole"
#}


