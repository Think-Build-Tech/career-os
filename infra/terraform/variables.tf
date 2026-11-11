variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {
  type    = string
  default = "careeros"
}

variable "environment" {
  type    = string
  default = "development"
}

variable "public_hostname" {
  description = "Public DNS hostname for the application. DNS remains managed by the domain's authoritative provider."
  type        = string
  default     = "dev-careeros.thinkbuild.in"
}

variable "tls_certificate_arn" {
  description = "ARN of an issued ACM certificate in aws_region for public_hostname. Leave empty to keep the bootstrap listener on HTTP."
  type        = string
  default     = ""

  validation {
    condition     = var.tls_certificate_arn == "" || can(regex("^arn:aws[a-z-]*:acm:[^:]+:[0-9]{12}:certificate/.+$", var.tls_certificate_arn))
    error_message = "tls_certificate_arn must be empty or a valid ACM certificate ARN."
  }
}

variable "vpc_cidr" {
  type    = string
  default = "10.42.0.0/16"
}

variable "db_name" {
  type    = string
  default = "careeros_dev"
}

variable "db_username" {
  type    = string
  default = "careeros"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "ai_service_api_key" {
  type      = string
  sensitive = true
}

variable "auth_token_secret" {
  type      = string
  sensitive = true

  validation {
    condition     = length(var.auth_token_secret) >= 32
    error_message = "auth_token_secret must contain at least 32 characters."
  }
}

variable "seed_admin_password" {
  type      = string
  sensitive = true
  default   = ""

  validation {
    condition     = var.seed_admin_password == "" || length(var.seed_admin_password) >= 12
    error_message = "seed_admin_password must be empty or contain at least 12 characters."
  }
}

variable "seed_user_password" {
  type      = string
  sensitive = true
  default   = ""

  validation {
    condition     = var.seed_user_password == "" || length(var.seed_user_password) >= 12
    error_message = "seed_user_password must be empty or contain at least 12 characters."
  }
}

variable "bedrock_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "bedrock_region" {
  type    = string
  default = "us-east-1"
}

variable "bedrock_model" {
  type    = string
  default = ""
}

variable "image_tag" {
  type    = string
  default = "bootstrap"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "db_multi_az" {
  type    = bool
  default = false
}

variable "db_backup_retention_period" {
  type    = number
  default = 0
}

variable "enable_deletion_protection" {
  type    = bool
  default = false
}
