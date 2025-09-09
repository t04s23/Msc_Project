# PLACEMENT MATCHING SYSTEM maintenance manual

## Contents

1. [Project Details](#project-details)  
2. [Setup Guide](#setup-guide)  
3. [How to Run](#how-to-run)  
4. [Tests](#tests)



## Project Details

The Placement Matching System is a web-based project developed using Flask as the backend framework and MongoDB as the database system. The platform enables the placement team to register both students and employers, allowing employers to post opportunities and both parties to rank each other. Based on these rankings, the system applies the Stable Marriage Algorithm to generate optimal matches between students and employers. Once the matches are generated, administrators review the results and send confirmation emails to both parties for final approval

-   **Flask**: A lightweight WSGI web application framework in Python for web application development.
-   **Pymongo**: An MongoDB toolkit and Object-Relational Mapping (ORM) library for Python.
-   **stable marriage**: Used for matching students to opportunities base on rankings by students and employers.
-   **Email Integration**: To send confirmation emails to employers and students.

## Setup Guide

1. Clone the repository to your local machine link is below
git@github.com:JosephXu20/FinalProject-main.git

2. Create virtual environment:
    
    python3 -m venv venv
    or 
    python -m venv venv
    
3. Activate the virtual environment:
    - On macOS/Linux:
        ```
        source venv/bin/activate
        ```
    - On Windows:
        ```
        .\venv\Scripts\activate
        ```
4. Install required packages
    ```
    pip install -r requirements.txt
    ```

## How to Run

-   To run the project, execute the following command:

    -   On macOS/Linux:
        ```
        ./run
        ```
    -   On Windows(powershell):
        ```
        .\run.ps1
        ```
 OR   python app.py


##  Placement Team Login Details

- Email: admin@admin.com
- Password: admin

## Registered Students' Login Details

- Student 1: 
    Username : 12345678
    Password : 123456

- Student 2: 
    Username : 11223344
    Password : 123456

- Student 3: 
    Username : 44556677
    Password : 123456

- Student 4: 
    Username : 55667788
    Password : 123456

- Student 5: 
    Username : 99112233
    Password : 123456

## Employer Login

- To sign in as an employer using email ID OTP will be sent once you login but those emails must be registered by admins otherwise they won't get OTP and they won't be able to login.for usage you can login as admin on portal and add email ID as emplyer and then login as employer.

## Deadlines guidelines

- There are 3 deadlines that are managed by the admin team ,which throughout their duration restrict the data that can be inputted and views available based on those deadlines
    1. Details Deadline - Students fill in their profile information and employers add opportunities
    2. Student ranking deadline - Students are allowed to view all available opportunities based on there profile and they can rank them within the deadline mentioned.
    3. Employer ranking deadline - this is the deadline when employers can see all the students ranked them and they can rank students aswell within that deadline.
- ONCE These deadlines are all passed then admins can see the matching interface with all the matched and unmatched students. 
## Tests

- There are many Test Files which you can run inidivdually as we tried to isolate each test for each part command can be used below for testing.

    pytest .\tests\<the test you want to run>

    Example :-    pytest .\tests\test_students.py
                  pytest .\tests\test_users.py


- FOR DETAILED USER GUIDE PLEASE CHECK HELP- USERGUIDE
