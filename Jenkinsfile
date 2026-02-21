pipeline{
    agent any
    environment {
        VENV = "venv"
        DATABASE_URL = "sqlite:///./test.db"
        SECRET_KEY = credentials('SECRET_KEY')
    }

    stages{
        stage("setup backend"){
            agent{
                docker{
                    image "python:3.12-slim"
                    reuseNode true
                }
            }
            steps{
                sh '''
                    echo "Installing Dependencies"
                    cd backend
                    python -m venv $VENV
                    . $VENV/bin/activate || $VENV\\Scripts\\activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install -r requirements-dev.txt
                '''
            }
        }
        stage("test backend"){
            steps{
                sh '''
                    echo "Running tests"
                    ls -al
                    cd backend
                    python -m venv $VENV
                    . $VENV/bin/activate || $VENV\\Scripts\\activate
                    ls -al
                    pytest --cov=app --cov-fail-under=80 --cov-report=term-missing
                '''
            }
        }
    }
}
