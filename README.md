# EasyFit - Virtual Outfit Creator

## Project Overview
EasyFit is an intuitive web application designed to streamline your morning routine by helping you create, customize, and manage virtual outfits. The platform allows users to mix and match different clothing items on a virtual mannequin, save their creations, and build a personal wardrobe of outfit combinations.

## Core Features

### User Experience
- **About Page**
  - Detailed mission statement
  - Key features overview
  - How-it-works guide
  - Team information
  - Contact details

### User Authentication
- Secure register/login system
- Protected routes
- JWT session management
- User profile management

### Outfit Creation & Management
- Interactive mannequin interface
- Drag-and-drop clothing placement
- Real-time resizing and positioning
- Gender-switchable mannequins
- Outfit customization options:
  - Season selection
  - Occasion tagging
  - Comfort level settings
  - Budget categorization
  - Fit type specification

### Profile Dashboard
- Personalized user statistics
- Recent outfits gallery
- Analytics:
  - Favorite seasons
  - Popular occasions
  - Usage patterns
- Quick access to outfit creation

### Catalog System
- Complete outfit library
- Detailed outfit views
- Edit and delete functionality
- Responsive grid layout
- Filtering and sorting options

## Technical Stack

### Frontend
- React.js 19.0.0
- React Router DOM 7.4.0
- Material-UI Components & Icons
- CSS Modules for styling
- Vite as build tool

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file handling
- Cloudinary for image storage and manipulation
- Remove.bg API integration

## Project Structure

### Frontend Architecture
```bash
frontend/
├── src/
│   ├── assets/          # Static resources
│   │   ├── img/         # Images
│   │   └── videos/      # Video content
│   ├── components/      # Reusable components
│   │   ├── Mannequin/   # Mannequin functionality
│   │   ├── context/     # Context providers
│   │   └── guards/      # Route protection
│   ├── pages/          # Main views
│   │   ├── About.jsx    # About page
│   │   ├── Create.jsx   # Outfit creator
│   │   └── Profile.jsx  # User profile
│   ├── styles/         # CSS modules
│   └── App.jsx         # Root component
```

### Backend Architecture
```bash
backend/
├── models/           # Data schemas
├── routes/          # API endpoints
├── middlewares/     # Custom middlewares
├── uploads/         # File management
└── server.js        # Entry point
```

## Getting Started

### 1. Clone the repository:
```bash
git clone [repository-url]
```

### 2. Install dependencies:
```bash
# Frontend setup
cd frontend
npm install

# Backend setup
cd backend
npm install
```

### 3. Environment Configuration:
Create a `.env` file in the backend directory:
```plaintext
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5005
REMOVE_BG_API_KEY=your_api_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


## remove.bg API Key Limitations

The remove.bg API key used for background removal has usage limitations. If you encounter an error message indicating that you need to pay for usage, it means you've exceeded the free tier limits.

### How to Obtain a New remove.bg API Key

To continue using the background removal feature, you'll need to create a new account and generate a new API key:

1.  **Create a New Account:** Go to [https://www.remove.bg/](https://www.remove.bg/) and sign up for a new account.
2.  **Generate API Key:** Once logged in, navigate to your account settings or API documentation to find your API key.
3.  **Update .env File:** Open the `.env` file in your project's root directory and replace the existing `REMOVE_BG_API_KEY` with your new API key.

    ```
    REMOVE_BG_API_KEY=your_new_api_key
    ```

    Replace `your_new_api_key` with the actual API key you generated.
4.  **Restart Server:** After updating the `.env` file, restart your Node.js server to apply the changes.

By following these steps, you can obtain a new remove.bg API key and continue using the background removal feature. 

### 4. Launch development servers:
```bash
# Start backend
cd backend
npm run dev

## Troubleshooting

### Permission Denied when Running Nodemon

If you encounter a "permission denied" error when trying to run `nodemon`, especially on Linux or macOS, you might need to give execute permissions to the `nodemon` script.

Run the following command in your terminal:

```bash
chmod +x node_modules/.bin/nodemon

# Start frontend
cd frontend
npm run dev
```

## API Documentation

### Authentication Endpoints
- `POST /auth/register` - New user registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Session termination
- `GET /auth/status` - Session verification

### Outfit Management
- `GET /api/outfits/all` - Retrieve all outfits
- `GET /api/outfits/:id` - Get specific outfit
- `POST /api/outfits/create` - Create outfit
- `PUT /api/outfits/edit/:id` - Update outfit
- `DELETE /api/outfits/delete/:id` - Remove outfit

### Community Endpoints
- `GET /api/outfits/community/all` - Retrieve all outfits for the community section.
- `POST /api/outfits/:outfitId/like` - Add a "like" reaction to an outfit.
- `POST /api/outfits/:outfitId/dislike` - Add a "dislike" reaction to an outfit.
- `POST /api/outfits/:outfitId/comment` - Add a comment to an outfit.
- `DELETE /api/outfits/delete/:outfitId` - Delete a specific outfit.

## Enhanced Features
- **Community Outfit Display:** Users can explore a gallery of outfits created by other users. Each outfit displays a preview image, the creator's username, and the number of likes, dislikes, and comments.
- **Outfit Reactions:** Users can express their opinions by liking or disliking outfits.
- **Outfit Comments:** Users can engage in discussions by adding comments to outfits.
- **Outfit Owner Identification:** The owner of each outfit is clearly displayed with their avatar and username.
- **Outfit Deletion & Editing:** Outfit owners can delete or edit their own outfits.
- **View Outfit in Detail:** Users can click on an outfit preview to view more details.
- **User Avatar:** All users have an avatar that is displayed in the community. If they don't upload one, a default avatar is displayed.

## Future Roadmap
- **Social sharing capabilities**
    - Users can share outfits and react to them.
- **Advanced categorization system**
- **Community features expansion**
- **Enhanced mobile experience**
- **Comprehensive testing**
- **Redux state management**
- **AI-powered outfit recommendations**
- **Weather integration**
- **Calendar scheduling**

## License
This project is licensed under the MIT License.