# Project Github 
I've created an example express API.  Inside the index.js you'll find a few examples of how to set up API endpoints as well as a few examples of what you can do with them.  This is a _very_ basic example.  Many things are missing to create a proper API such as 
* Proper user authentication - we don't want John Smith making an API call to Jane Smiths credit card
* Other HTML methods - in my example, I only use GET requests, but many others exist.  We will most likely only ever use GET or POST

For more examples of what Express can do see [here](https://expressjs.com/en/4x/api.html)

# Running the Server
Now to run this server is very simple.  You'll need to install NPM which is the Node Package Manager.

Installing Node
--------------- 
* Debian Based Linux

   ```
   sudo apt update
   sudo apt install nodejs npm
   ```
* OS X w/ Homebrew (I strongly recommend Homebrew if you don't have it, but it's not necessary _at all_ for the project.  It's just nice to have a package manager)

    ```
    brew install node
    ```
* OS X w/out Homebrew  - [Node has also provided a nice installer for you](https://nodejs.org/en/download/)
* Windows - [Node has also provided a nice installer for you](https://nodejs.org/en/download/)
* Other Linux - You can compile the source for yourself if you'd like, or find Node in whatever package manager your distro comes with.


# API Design
Now when I said to design you API, what I mean is to come up with the skeleton of all the endpoint you'll provide with the following information:
* Do they require authentication?  If no that means _anybody_ can get that endpoints information
* Should they be GET or POST requests?  A quick overview of this is GET endpoints get information (e.g. give me info about book with ISBN X) and POST endpoints send information to the server (e.g. add this book information to your database).
* What parameters will it have?  Will the be required parameters or optional?
* What _other_ API endpoints do you need?  For example, if a user is signed in and wants to add to checkout, you need to check with the profile management API if they have a valid payment method on file.

Information like that is what you should provide for your API design.  Getting this out of the way now will prevent, "Oopsie, I needed this feature" 4 weeks from now.  We'll still probably run into some, but the goal is to minimize that. 


# This README
This README isn't just a word document.  It's typed in what's called Markdown (common on a lot of forums such as Reddit's commenting).  For an overview of how to write in Markdown, see the [cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#lists)
