pipeline {
    agent any

    environment {
        VENV = "venv"
        DATABASE_URL = "sqlite:///./test.db"
        SECRET_KEY = credentials('SECRET_KEY')
    }

    stages {

        stage("Backend: Setup") {
            agent {
                docker {
                    image "python:3.12-slim"
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    cd backend
                    python3 -m venv $VENV
                    . $VENV/bin/activate
                    python3 -m pip install --upgrade pip
                    python3 -m pip install -r requirements.txt
                    python3 -m pip install -r requirements-dev.txt
                '''
            }
        }

        stage("Backend: Test") {
            agent {
                docker {
                    image "python:3.12-slim"
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    cd backend
                    . $VENV/bin/activate
                    python3 -m pytest --cov=app --cov-fail-under=80 --cov-report=term-missing
                '''
            }
        }
        stage("Backend: Build Docker Image") {
            steps {
                sh '''
                    set -e
                    cd backend
                    docker build -t exptrack-backend:latest .
                    docker images
                '''
            }
        }
        stage("Frontend: Test") {
            steps {
                sh '''
                    set -e
                    npm install
                    npm run test
                '''
            }
        }
        stage("Frontend: Build") {
            steps {
                sh '''
                    set -e
                    npm install
                    npm run build
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}