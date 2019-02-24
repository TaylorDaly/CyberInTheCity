# CyberInTheCity

#### Setup: #### 

1. Go into node-api and 'npm install'
2. Go into angular-src and 'npm install'
3. Go into angular-src and 'ng update @angular/cli' 
    * ng build to generate angular artifacts for Express to use.
4. Add .env to project. 
---
#### Troubleshooting ####
* Problem: project will not start after getting latest.

    Fix: Go into node-api and ```npm install``` 
    then go into angular-src and ```npm install```
    
    Could also be missing .env file.
    
* Problem: machine learning script won't run

    Fix: Install python 3 and makes sure it is set in the PATH.