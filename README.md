
# Bren-Aintroduce

This project offers an interactive platform for users to submit questions and receive responses generated by an AI, to know more about me (Brennan).
## Tech Stack:

Frontend:
- NextJs (with hooks)
- Formik (for form handling)
- Tailwind CSS (for styling)

Backend:
- Next.js (server-side rendering and API routes)

Storage:
- LocalStorage (for storing past questions and answers)

Additional Libraries:
- Yup (for form validation)
- axios (for HTTP requests)
## User Stories

| User Story | As a... | I want to... | So that... |
| --- | --- | --- | --- |
| US1 | User | easily submit a question |  I can get an AI-generated answer.|
| US2 | User |  view a list of questions I've previously asked | I can revisit the answers or reflect on what I've learned. |
| US3 | User | search my past questions using keywords | I can quickly find a specific question and its corresponding answer. |
| US4 | User | have an option to clear all my past questions | I can start afresh or ensure my privacy. |
| US5 | User | be notified if my question submission doesn't meet the criteria or if there's an error | I can rectify and resubmit accordingly. |
| US6 | User | access the platform on various devices including mobile and desktop, | I can have a seamless experience irrespective of the device I'm using. |

## API Reference

#### Get AI generated response

This API endpoint interfaces with OpenAI to generate a chat completion based on a user input. It returns an AI-generated response using the given input, and it's set to reply in the capacity of Brennan Lee.
```http
  POST /api/generateReponse
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userInput`      | `string` | **Required**. Question to get to know more about Brennan |



## Deployment

Prerequisites:
- Node.js and npm installed on your local machine.
- A configured OpenAI API Key.

Step 1: Clone the Repository
```bash
  git clone [repository-url]
```

Step 2: Navigate to the Project Directory:

```bash
    cd path-to-project-directory
```

Step 3: Install Dependencies

```bash
    npm install
```

Step 4: Configure OpenAI API Key .env
Create .env file, and add the line below

```bash
    openAiSecretKey=your_api_key_here
```
Step 5: Run the application

```bash
    npm run dev
```

Step 6: Run the application

Open your preferred web browser and navigate to http://localhost:3000 (or the port you have configured) to interact with the chat interface.


## Future Roadmap

User Authentication:

Implement user sign-up, login, and logout functionalities.
Add account profile management (profile picture, bio, password reset).

Multi-language Support:

Introduce multiple language options for the chatbot interface.
Enable real-time language translation within chat sessions.

## Authors

- [@brennanleez-coder](https://www.github.com/brennanleez-coder)

