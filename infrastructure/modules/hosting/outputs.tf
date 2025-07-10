output "website_bucket_name" {
  description = "Name of the website hosting bucket"
  value       = aws_s3_bucket.website.id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "website_url" {
  description = "URL of the website"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "deployment_access_key_id" {
  description = "Access key ID for deployment user"
  value       = var.create_deployment_user ? aws_iam_access_key.deployment[0].id : null
}

output "deployment_secret_access_key" {
  description = "Secret access key for deployment user"
  value       = var.create_deployment_user ? aws_iam_access_key.deployment[0].secret : null
  sensitive   = true
}
