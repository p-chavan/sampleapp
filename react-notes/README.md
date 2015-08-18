##react-notes

This application mainly utilizes React JS and the Flux architecture. 

It uses 
1)npm and bower for package management 

2)brunch to build it all up  

3)node's EventEmitter for event notifications as per the Flux architecture

4)Lowdb to store the data

5)Express to provide web server

Steps to run

1) git clone https://github.com/p-chavan/sampleapp.git

2) cd sampleapp/react-notes/

3)make build

4)make start

Access at http://localhost:3000.

1) Create : New task button will help to create new note

2) View and Delete links to view and delete the note

3) Update : Double click on note name , update the text and press enter to update

API

GET    http://localhost:3000/api/notes/ :- to get all notes

DELETE http://localhost:3000/api/notes/11 :- to delete note

GET    http://localhost:3000/api/notes/11 :- to get note

POST   http://localhost:3000/api/notes/ : to create note

POST   http://localhost:3000/api/notes/12 : to update note
