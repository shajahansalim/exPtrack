pipeline{
    agent any
    stages{
        stage("build"){
            steps{
                echo "========executing build========"
                sh '''
                    echo "checking node version"
                    node --version
                    echo "checking npm version"
                    npm --version
                '''
            }
        }
        stage("test"){
            steps{
                echo "========executing test========"
                sh '''
                    echo "running tests"
                    npm test
                '''
            }
        }
    }
}