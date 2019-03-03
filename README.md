# CyberInTheCity

#### Setup: #### 

1. Go into node-api and 'npm install'
2. Go into angular-src and 'npm install'
3. Go into angular-src and 'ng update @angular/cli' 
    * ng build to generate angular artifacts for Express to use.
4. Add .env to project. 
5. Machine learning script relies on python 3. Can be downloaded at https://www.python.org/downloads/.
    * After installing Python 3 run 
        ```
        pip install nltk      
        pip install sklearn
        ```
    * Then open a terminal and run the following to download the NLTK dependencies. 
         ```
         python
         import nltk
         nltk.download('stopwords')
         nltk.download('punkt')
         exit()
         ```
---
#### Troubleshooting ####
* Problem: project will not start after getting latest.

    Fix: Go into node-api and ```npm install``` 
    then go into angular-src and ```npm install```
    
    Could also be missing .env file.
    
* Problem: machine learning script won't run

    Fix: Install python 3 and makes sure it is set in the PATH.