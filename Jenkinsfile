pipeline{
    agent any
    stages{
        stage("build backend"){
            agent{
                docker{
                    image "python:3.12-slim"
                    reuseNode true
                }
            }
            steps{
                echo "****** Building backend *******"
                sh '''
                    echo "Installing Dependencies"
                    ls -al
                '''
            }
        }
    }
}
