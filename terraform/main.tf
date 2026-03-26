provider "aws" {
  region = "eu-west-2"
}

locals {
  lambda_base_path = "../aws/lambdas"
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_apigatewayv2_api" "main_api_gateway" {
  name        = "my-api-gateway"
  description = "API Gateway for my application"
  protocol_type = "HTTP"
}

resource "aws_lambda_function" "my_api_lambda" {
  function_name = "my-api-lambda"
  handler       = "lambda.handler"
  runtime       = "nodejs24.x"
  role          = aws_iam_role.lambda_exec_role.arn
  filename      = "${local.lambda_base_path}/my-api/dist/lambda.zip"
  source_code_hash = filebase64sha256("${local.lambda_base_path}/my-api/dist/lambda.zip")
}

resource "aws_iam_role_policy_attachment" "lambda_basic_logs" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_apigatewayv2_integration" "my_api_lambda_integration" {
  api_id = aws_apigatewayv2_api.main_api_gateway.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.my_api_lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_root" {
  api_id    = aws_apigatewayv2_api.main_api_gateway.id
  route_key = "GET /"

  target = "integrations/${aws_apigatewayv2_integration.my_api_lambda_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main_api_gateway.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main_api_gateway.id
  name        = "$default"
  auto_deploy = true
}