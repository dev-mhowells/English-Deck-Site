# English Deck

English Deck is as a minimum viable product for an online-learning platform built with React. The goal was to create highly interactive articles for English learners which included flashcards, quizzes, writing practice, and the ability to read submissions from other learners. What started with an idea for a single page layout which included all of these elements, grew into site based around these articles with its own custom build content management system.

## Technology

It made sense to create the app with React because I wanted the interactive elements of the site to be reusable and as modular as possible. This was not only because some of these elements are used multiple times within the same page, but also to allow me to easily build on the project by creating different page layouts and weaving in new interactive components should I wish to do so in the future. Using Firebase was also an obvious choice as it allows for rapid development in terms of database, storage, authentication and deployment.

## Challenges

I had built the article itself a little while ago and there was some challenge involved with integrating its various components with the new database structure I had decided on while building the CMS. There was also some challenge associated with standardising the design of the app between the landing page and article elements. This is something which is still a work in progress. Coming back to CSS I had had previously written certainly brought home the importance of naming classes properly.

I also had to think about how to organise the database when it came to storing user comments. As Firebase is optimised for collections which can hold a large number of smaller documents, I decided on a structure whereby individual articles are stored as documents inside a larger collection, but also contain their own subcollection which holds a separate document for each user comment. This appears to be the most performant solution.

When deciding to build the site, I knew I would need some kind CMS which allowed me to publish articles to the site, but which would also allow me to populate more the more intricate components which aren’t simply blocks of text. Ultimately I decided that I wanted complete control over this process and decided to build a custom CMS structured around the components in the app.
