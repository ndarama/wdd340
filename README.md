## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.
## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code (VSC).

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

    pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.
1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

    pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.
1. Find and move that simple web page to the public folder. Be sure to note its name.
## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.

## Vehicle Review System

### Overview
The Vehicle Review System allows authenticated users to create, read, update, and delete reviews for vehicles in the inventory. This feature enhances user engagement and provides valuable feedback for potential customers.

### Features
- Star rating system (1-5 stars)
- Text reviews with character counter and validation
- User-specific review management
- Review display on vehicle detail pages
- Edit and delete functionality for user's own reviews

### New Files Created
- **Database**
  - `database/review.sql` - Database schema for the review table
  - `database/test-reviews.sql` - Sample review data for testing

- **Models**
  - `models/review-model.js` - Database interaction functions for reviews

- **Controllers**
  - `controllers/reviewController.js` - Business logic for review operations

- **Routes**
  - `routes/review-route.js` - API endpoints for review operations

- **Views**
  - `views/reviews/add-review.ejs` - Form for adding new reviews
  - `views/reviews/edit-review.ejs` - Form for editing existing reviews
  - `views/reviews/delete-confirm.ejs` - Confirmation page for review deletion
  - `views/reviews/user-reviews.ejs` - Page displaying all reviews by the logged-in user
  - `views/partials/review-item.ejs` - Reusable component for displaying a review

- **Client-side**
  - `public/js/review.js` - JavaScript for interactive star rating and form validation

- **Utilities**
  - `utilities/review-validation.js` - Server-side validation for review data

### Testing the Feature
1. **Load Test Data**:
   - Run the SQL commands in `database/test-reviews.sql` to populate the database with sample reviews

2. **View Reviews**:
   - Browse to any vehicle detail page to see existing reviews
   - Reviews are displayed with star ratings and reviewer information

3. **Add a Review**:
   - Log in to your account
   - Navigate to a vehicle detail page
   - Click "Write a Review" button
   - Fill out the form with a rating and review text
   - Submit the form to create your review

4. **Manage Your Reviews**:
   - Go to the Account Management page
   - Click "View Your Vehicle Reviews"
   - From this page, you can view, edit, or delete your reviews

5. **Edit/Delete Reviews**:
   - On the user reviews page, click "Edit" or "Delete" for any review
   - Follow the prompts to complete the action
