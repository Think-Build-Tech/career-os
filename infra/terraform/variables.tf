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
