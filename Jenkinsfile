pipeline{
    agent any
    environment {
        VENV = "venv"
        DATABASE_URL = "sqlite:///./test.db"
    }

    stages{
        stage("build backend"){
            agent{
                docker{
                    image "python:3.12-slim"
                    reuseNode true
                }
            }
            steps{
                echo "****** Testing backend *******"
                sh '''
                    echo "Installing Dependencies"
                    cd backend
                    python -m venv $VENV
                    . $VENV/bin/activate || $VENV\\Scripts\\activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install -r requirements-dev.txt
                    echo "Running tests"\
                    sleep 10
                    pytest --cov=app --cov-fail-under=80 --cov-report=term-missing
                '''
            }
        }
    }
}
