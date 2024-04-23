
data "aws_ecs_cluster" "my_cluster" {
  cluster_name = "Storm-Sentry-Cluster"
}

data "aws_iam_role" "ecs_execution_role" {
  name = "ecsTaskExecutionRole"
}

data "aws_ecs_task_definition" "existing_task" {
  task_definition = "Handler-fargate"
}
