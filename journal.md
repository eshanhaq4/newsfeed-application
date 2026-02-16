**Development Journal**

**Entry #1**
**Date:** 02/05/26
**Time Spent:** 2 hours
**Commit Hash:** ea4679f

**What I Worked On:**
Fully understand the project and review the RFC again to understand what is being implemented, how, and why, etc. Initialized the Django backend, created the overall project structure, configured a virtual environment, and ensured the development server ran locally, just a basic test to make sure I set up Django correctly. Also created the .gitignore and added /venv to avoid committing any environment-specific files.
This was mostly about following along with the Django documentation to start out and learning more about it for future entries. I wanted to take the time to figure out how to properly structure things, learn about things like models and migrations, and avoid blindly following any tutorial steps.

**What Didn’t Work / Issues Encountered:**
Since I have never/rarely used Django prior to this class, I initially encountered a lot of confusion around how Django actually structures projects and how to run what commands when, etc. Also spent a tiny bit of time learning about the virtual environment and why it's useful.

**Debugging / Dead Ends:**
Ran into some issues with the server not starting because the virtual environment was not activated properly. But overall, no issues really yet, as this was early setup and learning. I was also having a small issue with committing changes at first, as Git was tracking all of the environment’s dependency files, resulting in way too many files being changed. This was resolved by making the gitignore.

**Design Decisions & Tradeoffs:**
Given the scope of this project and the emphasis on correctness under failure modes, I chose to use GraphQL via Django (Strawberry) for the backend as it allows for more rapid prototyping/testing and is much more straightfowrward overall in regards to implementing things like mutations later on. 

**What I Learned:**
I learned how Django organizes its projects, how Django actually works, some other aspects of overall GitHub and Fullstack project setup. I also gained a better understanding of virtual environments and Django/backend as a whole.

**Entry #2**
**Date:** 02/06/26
**Time Spent:** 2-2.5 hours
**Commit Hash:** a5d37de

**What I Worked On:**
Initialized the feed Django app, configured routing, added the app to INSTALLED_APPS, and resolved several setup issues preventing the development server from running correctly. This was also more of, following along with Django tutorial and pausing as I went along to understand every single step and feature in the documentation. 

**What Didn’t Work / Issues Encountered:**
Initially, after creating the feed app, the server would not properly route to my test endpoint. I realized that just creating the app was not enough. Django requires apps to be explicitly added to INSTALLED_APPS in settings.py. Without this, Django doesn't register models or the app.

**Debugging / Dead Ends:**
Got a little bit confused with the two url.py files. I initially forgot to include the feed.urls in the main urlpatterns, which resulted in 404 errors when navigating to /feed/. Also added db.sqlite3 to the gitignore to prevent committing the local db state.

**Design Decisions & Tradeoffs:**
No real design decisions had to be made here, it was more of understanding the project vs. app level with Django/this kind of project structure.

**What I Learned:**
I learned project vs. app level, what's needed for INSTALLED_APPS, and more of Django overall from looking at the documentation and following along with the basic setup tutorial to get the basic structure working. 

**Entry #3**
**Date:** 02/07/26
**Time Spent:** 2 hours
**Commit Hash:** 91e8519

**What I Worked On:**
Implemented the data models for the application by defining the Post and Like models and running + testing the initial migrations. Basically, going from simple setup to implementing the actual application logic we planned and discussed in the rfc. The Post model includes: creator_id, content, created_at, edited_at, like_count The Like model includes: user_id, ForeignKey to Post, created_at, the unique_together constraint (user_id, post). I also ran makemigrations and migrate to generate and actually apply the initial schema to the database. I made sure the tables were created correctly and began thinking through how the like/unlike behavior would be implemented later.

**What Didn’t Work / Issues Encountered:**
Initially, I was unsure whether the like_count should exist as a stored field and incremented, or be dynamically computed from the number of related Like objects. In other words, simply incrementing a like_count variable like in my rfc vs. using post.likes.count(). I also had to make sure that the migration file reflected the intended schema from the rfc and that the database state matched the models after running migrations.

**Debugging / Dead Ends:**
No real dead ends or debugging issues here, apart from learning how to actually test the backend (these models) and see how they work/if they work as intended.

**Design Decisions & Tradeoffs:**
The main tradeoff here was how to deal with like_count, whether to increment it as a stored field (like_count += 1) or have it be computed dynamically (post.likes.count()). I chose the first option, storing it directly in the Post model. The tradeoff is potential inconsistencies when updating the like_count, the likes not being updated properly, but in exchange there's improved feed query performance and simplifies pagination.

**What I Learned:**
I learned more about models in Django and how to think about data integrity at multiple layers, not just the application layer but the db layer as well. In the case of this project, of this scale with decisions like these, I think it's okay to prioritize straightforwardness and simplification.

**Entry #4**
**Date:** 02/08/26
**Time Spent:** 2-2.5 hours
**Commit Hash:** 0c8c2d3

**What I Worked On:**


**What Didn’t Work / Issues Encountered:**


**Debugging / Dead Ends:**


**Design Decisions & Tradeoffs:**


**What I Learned:**

