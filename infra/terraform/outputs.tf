output "application_url" {
  value = local.https_enabled ? "https://${var.public_hostname}" : "http://${aws_lb.main.dns_name}"
}

output "api_health_url" {
  value = local.https_enabled ? "https://${var.public_hostname}/api/health" : "http://${aws_lb.main.dns_name}/api/health"
}

output "load_balancer_dns_name" {
  description = "Create a CNAME for public_hostname pointing to this value at the authoritative DNS provider."
  value       = aws_lb.main.dns_name
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

output "database_seed_task_definition" {
  value = aws_ecs_task_definition.database_seed.arn
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs.id
}
