pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "Cloning repo from GitHub"
                    // Clone the branch based on which one is being built
                    git branch: "${BRANCH_NAME}", url: 'https://github.com/Kairovus/Weather-Check.git'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image in ${BRANCH_NAME} branch"
                    bat "docker build -t weather-check-image-${BRANCH_NAME} ."
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // In the code below, we are defining a different port for a different branch that
                    // are going to be used to remap the port in the docker container 
                    def branchPort
                    switch (BRANCH_NAME) {
                        case 'main':
                            branchPort = 8081
                            break
                        case 'beta':
                            branchPort = 8082
                            break
                       
                        default:
                            branchPort = 4000  // Default port for unknown branches
                    }

                    echo "Stopping and removing any existing container for ${BRANCH_NAME}"
                    bat "docker stop weather-check-container-${BRANCH_NAME} || exit 0"
                    bat "docker rm weather-check-${BRANCH_NAME} || exit 0"

                    echo "Running new container for ${BRANCH_NAME} on port ${branchPort}"
                    bat "docker run --rm -d --name weather-check-container-${BRANCH_NAME} -p ${branchPort}:80 weather-check-image-${BRANCH_NAME}"

                    echo "Container for ${BRANCH_NAME} is running on port ${branchPort}"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline success!'
        }
        always {
            echo 'Pipeline completed!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
