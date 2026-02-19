pipeline{
    agent any
    stages{
        stage("build"){
            agent{
                docker{
                    image "node:24-alpine3.22"
                    reuseNode true
                }
            }
            steps{
                echo "========executing build========"
                sh '''
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -al
                '''
            }
        }
        stage("test"){
            steps{
                echo "========executing test========"
                sh '''
                    echo "running tests"
                '''
            }
        }
    }
}