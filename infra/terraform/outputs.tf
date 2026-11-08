output "application_url" {
  value = "http://${aws_lb.main.dns_name}"
}

output "api_health_url" {
  value = "http://${aws_lb.main.dns_name}/api/health"
}

output "ecr_api_repository" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_web_repository" {
  value = aws_ecr_repository.web.repository_url
}

output "ecr_ai_repository" {
  value = aws_ecr_repository.ai.repository_url
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}
