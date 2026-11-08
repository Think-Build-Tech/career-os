# CareerOS AWS deployment

This repository deploys three containers to ECS Fargate:

- Angular web app
- Node/Express API
- Python TACIE AI framework

PostgreSQL runs on Amazon RDS. ECR stores images, the public Application Load Balancer routes `/api/*` to the API and all other paths to Angular, and Cloud Map gives the API a private `ai-framework.careeros.local` address.

## One-time AWS prerequisites

Install AWS CLI, Terraform 1.9+, and Docker. Choose the AWS region and create a dedicated deployment account/role.

Create the Terraform state bucket and lock table once:

```powershell
$Region = "ap-south-1"
$Bucket = "careeros-terraform-state-<account-id>"
$Table = "careeros-terraform-lock"

aws s3api create-bucket --bucket $Bucket --region $Region --create-bucket-configuration LocationConstraint=$Region
aws s3api put-bucket-versioning --bucket $Bucket --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket $Bucket --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws dynamodb create-table --table-name $Table --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $Region
```

Create a GitHub OIDC provider in IAM with:

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

Create an IAM role trusted only for this repository’s `main` branch. Its trust condition should include:

```json
"token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main"
```

Templates are provided in `infra/aws/github-actions-trust-policy.json` and `infra/aws/github-actions-deploy-policy.json`. Replace the placeholders before applying them. The deployment policy is intentionally broad for the initial Terraform bootstrap; narrow its resource permissions once the stack is established.

The role needs the permissions required by Terraform to create VPC, ECS, ECR, RDS, ALB, CloudWatch Logs, Secrets Manager, Cloud Map, and IAM task roles, plus S3/DynamoDB state access. Keep this role dedicated to deployment and scope the resource permissions further after the first successful bootstrap.

GitHub recommends OIDC for AWS deployments because the workflow receives short-lived credentials instead of storing long-lived AWS access keys. See [GitHub’s AWS OIDC guide](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws).

## Local infrastructure bootstrap

Copy the example variables and set real values. Do not commit the resulting `terraform.tfvars`.

```powershell
Copy-Item infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
terraform -chdir=infra/terraform init `
  -backend-config="bucket=YOUR_STATE_BUCKET" `
  -backend-config="key=careeros/production/terraform.tfstate" `
  -backend-config="region=ap-south-1" `
  -backend-config="dynamodb_table=YOUR_LOCK_TABLE" `
  -backend-config="encrypt=true"

# First apply creates networking, RDS, IAM, ECS, and empty ECR repositories.
terraform -chdir=infra/terraform apply -var="desired_count=0" -var="image_tag=bootstrap"
```

The first apply intentionally keeps ECS at zero tasks because the ECR repositories are empty. The GitHub workflow performs this bootstrap automatically when it detects that the repositories do not exist, then builds and pushes the images and applies the running services.

## GitHub repository configuration

Add these repository/environment values to a protected `production` environment:

Secrets:

- `AWS_DEPLOY_ROLE_ARN`
- `TF_VAR_DB_PASSWORD`
- `TF_VAR_AI_SERVICE_API_KEY`
- `TF_VAR_BEDROCK_API_KEY`

Variables:

- `AWS_REGION` (for example `ap-south-1`)
- `TF_STATE_BUCKET`
- `TF_STATE_LOCK_TABLE`
- `TF_VAR_BEDROCK_MODEL`

After that, every push to `main` runs `.github/workflows/deploy.yml`. Pull requests and pushes also run `.github/workflows/ci.yml`.

## Operational notes

- Replace the placeholder Bedrock model/key before enabling TACIE generation.
- The RDS password and AI credentials are injected from Secrets Manager; they are not placed in container images.
- The default Terraform NAT gateway and RDS settings are suitable for a first deployment, but they incur AWS charges. Enable `db_multi_az` and `enable_deletion_protection` for a production workload after validating the environment.
- The current ALB listener is HTTP on port 80. Add an ACM certificate and HTTPS listener before exposing real student data publicly.
