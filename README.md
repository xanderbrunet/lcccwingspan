# The Wingspan 🖼️

## Laramie County Community College’s Student Journal

Welcome to the official repository for **The Wingspan**, Laramie County Community College's student-run journal. Here, we showcase student stories, insights, and campus news to keep our community informed and engaged.

## About The Project

**The Wingspan** is dedicated to delivering relevant news and stories by and for the students of LCCC. This Next.js project brings the journal online, providing an accessible, modern platform to read, explore, and contribute to our campus community.

## Features

- **News and Articles** – Stay up-to-date with the latest campus happenings.
- **Student Voices** – A section for opinion pieces, creative writing, and student submissions.
- **Interactive Design** – Built with a responsive layout for a seamless experience on any device.
- **Search and Categories** – Find articles by topic, date, or popularity.

## Technologies Used

- **Next.js** – For a fast, server-rendered, React-based website.
- **Tailwind CSS** – To create a clean, responsive design.
- **Supabase** – Manages backend and data storage for articles and user interactions.

## Folder Structure

```
/app
  ├── /components - Reusable UI components
  ├── /pages - Page routes and layouts
  ├── /styles - Global styles
  └── /public - Static assets
```

## Getting Started

### Clone the Repository:
```bash
git clone https://github.com/xanderbrunet/lcccwingspan.git
```

### Install the Dependencies:
```bash
cd lcccwingspan
npm install
```

### Run the Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Environment Setup:
Create a `.env.local` file in the root directory to store your environment variables. Here is an example:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Build for Production:
To build the application for production:
```bash
npm run build
```

To run the built version:
```bash
npm start
```

## Contributing

We welcome contributions! To suggest a feature or report a bug, please open an issue or submit a pull request.

### Steps to Contribute:

1. **Fork the Repository**
   ```bash
git fork https://github.com/xanderbrunet/lcccwingspan.git
```

2. **Create a Branch for Your Feature**
   ```bash
git checkout -b feature/your-feature-name
```

3. **Make Your Changes**

4. **Commit Your Changes**
   ```bash
git commit -m "Add a descriptive commit message"
```

5. **Push to Your Branch**
   ```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**

## License

This project is licensed under the MIT License.

Thank you for checking out **The Wingspan** project! We look forward to making LCCC’s news more accessible, engaging, and interactive.