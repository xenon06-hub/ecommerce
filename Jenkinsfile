pipeline {
    agent any

    environment {
        AWS_REGION      = 'eu-north-1'
        ECR_REGISTRY    = '802854082682.dkr.ecr.eu-north-1.amazonaws.com'
        FRONTEND_REPO   = "${ECR_REGISTRY}/ecommerce-frontend"
        BACKEND_REPO    = "${ECR_REGISTRY}/ecommerce-backend"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        CLUSTER         = 'ecommerce-cluster'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        sh "docker build --platform linux/amd64 -t ${FRONTEND_REPO}:${IMAGE_TAG} ./frontend"
                        sh "docker tag ${FRONTEND_REPO}:${IMAGE_TAG} ${FRONTEND_REPO}:latest"
                    }
                }
                stage('Build Backend') {
                    steps {
                        sh "docker build --platform linux/amd64 -t ${BACKEND_REPO}:${IMAGE_TAG} ./backend"
                        sh "docker tag ${BACKEND_REPO}:${IMAGE_TAG} ${BACKEND_REPO}:latest"
                    }
                }
            }
        }

        stage('Push to ECR') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-credentials') {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        docker push ${FRONTEND_REPO}:${IMAGE_TAG}
                        docker push ${FRONTEND_REPO}:latest
                        docker push ${BACKEND_REPO}:${IMAGE_TAG}
                        docker push ${BACKEND_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-credentials') {
                    sh """
                        aws ecs update-service \
                            --cluster ${CLUSTER} \
                            --service ecommerce-frontend \
                            --force-new-deployment \
                            --region ${AWS_REGION}

                        aws ecs update-service \
                            --cluster ${CLUSTER} \
                            --service ecommerce-backend \
                            --force-new-deployment \
                            --region ${AWS_REGION}
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-credentials') {
                    sh """
                        echo 'Waiting for deployment...'
                        sleep 30
                        aws ecs describe-services \
                            --cluster ${CLUSTER} \
                            --services ecommerce-frontend ecommerce-backend \
                            --region ${AWS_REGION} \
                            --query 'services[*].{Service:serviceName,Running:runningCount,Desired:desiredCount}' \
                            --output table
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
            echo "App URL: http://ecommerce-alb-263270954.eu-north-1.elb.amazonaws.com"
        }
        failure {
            echo 'Pipeline failed! Check logs above.'
        }
    }
}