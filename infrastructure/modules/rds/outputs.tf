output "db_endpoint" {
  description = "The database endpoint to connect to"
  value       = aws_db_instance.postgres.endpoint
}
