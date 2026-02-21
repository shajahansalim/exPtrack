pipeline {
    agent any

    environment {
        VENV = "venv"
        DATABASE_URL = "sqlite:///./test.db"
        SECRET_KEY = credentials('SECRET_KEY')
    }

    stages {

        stage("Backend: Setup & Test") {
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

                    echo "Creating virtualenv"
                    python3 -m venv $VENV
                    . $VENV/bin/activate

                    echo "Installing dependencies"
                    python3 -m pip install --upgrade pip
                    python3 -m pip install -r requirements.txt
                    python3 -m pip install -r requirements-dev.txt

                    echo "Running tests"
                    python3 -m pytest --cov=app --cov-fail-under=80 --cov-report=term-missing
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