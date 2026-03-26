output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.main_api_gateway.api_endpoint
}