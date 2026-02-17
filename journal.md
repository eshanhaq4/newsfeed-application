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
Initially, I was unsure whether the like_count should exist as a stored field and be incremented, or be dynamically computed from the number of related Like objects. In other words, simply incrementing a like_count variable like in my rfc vs. using post.likes.count(). I also had to make sure that the migration file reflected the intended schema from the rfc and that the database state matched the models after running migrations.

**Debugging / Dead Ends:**
No real dead ends or debugging issues here, apart from learning how to actually test the backend (these models) and see how they work/if they work as intended.

**Design Decisions & Tradeoffs:**
The main tradeoff here was how to deal with like_count, whether to increment it as a stored field (like_count += 1) or have it be computed dynamically (post.likes.count()). I chose the first option, storing it directly in the Post model. The tradeoff is potential inconsistencies when updating the like_count, the likes not being updated properly, but in exchange there's improved feed query performance and simplifies pagination.

**What I Learned:**
I learned more about models in Django and how to think about data integrity at multiple layers, not just the application layer but the db layer as well. In the case of this project, of this scale with decisions like these, I think it's okay to prioritize straightforwardness and simplification.

**Entry #4**
**Date:** 02/08/26
**Time Spent:** 2 hours
**Commit Hash:** 0c8c2d3

**What I Worked On:**
Integrated Strawberry GraphQL (spent some time reading through the documentation/tutorial) into the Django backend and worked with the /graphql/ endpoint. Defined a PostGQL type and implemented an initial posts query to successfully retrieve posts in reverse chronological order, as they are meant to. I configured the routing in urls.py and connected the schema. I also successfully tested my query via GraphiQL to confirm that a feed/posts can actually be retrieved from the database and seen through GraphQL.

**What Didn’t Work / Issues Encountered:**
When I was testing my GraphQL, I ran into CSRF-related errors when trying to execute my GraphQL POST requests. I found out that Django’s default CSRF protection blocks POST requests without a valid token, which prevented the endpoint from functioning properly until I wrapped the view with csrf_exempt. This took me longer to fix that I would've liked.

**Debugging / Dead Ends:**
I had to refresh my memory in regards to using the devtools and inspecting messages to find what the errors actually are. Before doing that, I was at a loss as to why the error was occuring-why my POST requests were being rejected even though the endpoint was registered. Using csrf_exempt was the most simple and appropriate solution.

**Design Decisions & Tradeoffs:**
The main design decision here was to use csrf_exempt, which reduces CSRF protection. That's perfectly fine for this project since we aren't worrying about authentication and it's a more simple project.

**What I Learned:**
I learned about CSRF, how GraphQL schemas and queries are defined in Strawberry, and how to map model fields to GraphQL types.

**Entry #5**
**Date:** 02/09/26
**Time Spent:** 3-4 hours
**Commit Hash:** dd3734c and f380c49

**What I Worked On:**
First, I finished up my implementation of the core GraphQL mutations (create, edit, delete, toggle_like). At this point, I tested thoroughly to make sure each mutation works with the proper backend functionality, and committed these changes/additions for the queries, mutations, and working state. Then, I refactored the feed query to implement cursor-based pagination, using the (created_at, id) pair, and order_by("-created_at", "-id"). I also used atomic transactions and select_for_impact to make the toggle safe in race conditions.

**What Didn’t Work / Issues Encountered:**
The main issue encountered and fixed was one of the most important issues of this project - race conditions for likes. There were multiple ways to solve this and it was crucial to ensure that there can't be any duplicate or conflicting likes and ensuring that the program has the proper state. But using atomic conditions solved this, by making sure that the row is locked - one request has to be processed before the next can be.

**Debugging / Dead Ends:**
There wasn't too much to debug here since I had all of this implementation planned out already. Initially, I had implemented toggle_like without handling the race conditions just to get something working, which could allow two concurrent toggles to have the same like_count because of the race condition. After these changes, I tested thoroughly and everything seemed to be fine, on both a slow and fast network.

**Design Decisions & Tradeoffs:**
Again, the main decision/tradeoff here was just implementing cursor-based pagination over offset in order to handle race conditions. It's more complex but it Prevents any duplicate and missing posts when new content is added and it makes sure the ordering is as intended. The other main tradeoff was doing this at the backend/db level rather than the frontend, which would include something like disabling the like button temporarily to properly process requests. But that doesn't guarantee global correctness and although it makes for simpler code, it doesn't guarantee prevention against duplicate likes, and the correctness for the system depends too much on the client. Ideally, there's more guarantee for this safe handling at the cost of slightly more complex code and having to use transactions.

**What I Learned:**
I learned how to implement cursor-based pagination and how it interacts with the other aspects. I learned about atomic conditions, row-level locks, and how Django transactions can prevent race conditions. I also learned about doing all of this at the database/backend level.

**Entry #6**
**Date:** 02/12/26
**Time Spent:** 3 hours
**Commit Hash:** 99e0252

**What I Worked On:**
This entry ended up being a lot longer than I anticipated. So firstly, I set up the frontend portion of the project, Next.js. However, I wasn't entirely sure of a lot of things, such as how to organize my files/the code, what files and folders I needed and where. As a result, I decided, for now, to implement the initial feed integration directly inside page.tsx and only page.tsx just to get it working and to verify that the backend GraphQL endpoint was working correctly and that it could link with the Frontend. With that, it involved testing everything, like making sure that pagination worked and that the data could be seen, fetched, displayed, and updated in state. I intentionally did not abstract this part of the code yet into components and different files because I wanted to confirm backend correctness quicker before figuring out and introducing more parts.

**What Didn’t Work / Issues Encountered:**
This commit had more challenges than I expected, not particularly from the coding but from the general planning and from some Git mistakes. Since I had just finished the backend, I forgot to create a new branch for Frontend and switch to it, so I accidentally committed all of this frontend code and all these created files to the backend branch. While this wasn't technically a terrible issue and I could have proceeded normally, I wanted to figure out how to revert this change and see if I could learn what to do in cases like these, beyond this project specifically. I was able to successfully revert the change and make the new branch successfully but it took some time as I was very nervous about messing anything up further that I didn't want to happen.

**Debugging / Dead Ends:**
There weren't really any major issues to debug apart from making sure that pagination and everything else from the backend works fine. So, I manually tested everything with creating, editing, deleting posts, loading additional pages, making sure nextCursor works.

**Design Decisions & Tradeoffs:**
The main design decision/tradeoff at this point that I made was putting as much code as I did in page.tsx at first, at this stage, and refactoring later, instead of splitting everything into their appropriate files immediately. The tradeoff here is that while there's less clean code initially, it helped me debug and verify this code faster, making everything simpler as it was much easier to refactor the code after it worked.

**What I Learned:**
I learned about how to actually connect backend (GraphQL) to the frontend (Next.js) and also more about git branches and commands in regards to commits and reversions.

**Entry #7**
**Date:** 02/13/26
**Time Spent:** 2-2.5 hours
**Commit Hash:** c950750 and e4d551b

**What I Worked On:**
For this entry, I had two main commits. Firstly, I refactored the frontend to have a better structure, having a file for the Feed logic (Feed.tsx) and the api-related code and GraphQL fetch (api.ts). page.tsx became extremely short and simple as a result, which makes sense. The code itself is mostly the same, but now there's separation for the UI, api layer, and layout, making the strutcure of the frontend much more clear and easy to follow. Then, I added to both api and Feed by implementing the toggleLike mutation on the frontend. I added the needed functions to those two files and then the UI state is updated. This way, when the user decided to click the 'Like' button, the updated post is returned after the mutation runs on the backend, and the update is made, with the UI reflecting the server's state. 

**What Didn’t Work / Issues Encountered:**
There weren't very many challenges here. No real challenges with refactoring the code other than thinking through what code belongs where. I also had to make sure that even after refactoring the code and moving all the logic from one file to multiple, that everything with the logic, fields, pagination, and the state, etc. still worked properly.

**Debugging / Dead Ends:**
There weren't really any major issues to debug apart from making sure that pagination and everything else from the backend works fine. So, I manually tested everything with creating, editing, deleting posts, loading additional pages, making sure nextCursor works, etc.

**Design Decisions & Tradeoffs:**
I initially considered simply refetching the entire feed after a like toggle. That would have been simpler but it would have also been more inefficient and less intentional. The only other tradeoff/decision was how to refactor my code, and having everything like this, with api and feed and page separate, makes for cleaner separation albeit more files and abstraction. The other main tradeoff here was waiting for the server response and using that for the post. It allows for more guaranteed correction and keeps consistency between the frontend and backend.

**What I Learned:**
I learned about how to organize the frontend properly, not only what code needs to be written but _how_ it should be written, where, how it should be separated and refactored, etc. I also learned about how to actually work with server-authoritative updates.

**Entry #8**
**Date:** 02/14/26
**Time Spent:** 4-5 hours
**Commit Hash:** 9e113f1, 37bb7ba, and fff93d0

**What I Worked On:**
This entry was a lot, and finishing the project. I created the create and delete post mutations in api.ts, along with the associated UI, buttons, and state updates, making sure that all the backend logic and states are preserved and consistent with the frontend without having to keep refetching. I also did the same with the edit post mutation, which required slightly more implementation to make conditional rendering, so that there's different displays for when a post is just displayed vs. being edited. I also added some basic GraphQL error handling for api calls, to make the frontend more defensive. Finally, I made some general UI updates to clean up the display, center the layout, change the colors, improve the styling, adding an emoji for the like button, etc. Just some general polishing and verifying that everything works, and I manually tested everything to make sure.

**What Didn’t Work / Issues Encountered:**
One small concern during all of this was state consistency. I needed to make sure that nothing broke when the user tried any of the buttons and fuctions, like accidental duplications, updates, or removals for anything like posts or likes. Overall, no real concerns at this point though, other than figuring out the logic for edit.

**Debugging / Dead Ends:**
There weren't really any major issues to debug. At this point, all of the logic was figured out or being figured out, just needed to implement it. Only debugging I really had to do/dead end I faced was at the very end with figuring out how to make the UI better and prettier.

**Design Decisions & Tradeoffs:**
Like the previous section, no major decisions/tradeoffs to worry about, just testing everything. 

**What I Learned:**
Overall, I learned a lot here, the final parts of implementing the frontend, mutation and state design, and even more simple things like UI updates and overall design, those are small but crucial in shaping the user's experience with the application.
