import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddEditRecipePage from './pages/AddEditRecipePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import PrivateRoute from './components/PrivateRoute';
import AuthInitializer from './components/AuthInitializer';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/recipes/:id/edit" element={
                  <PrivateRoute>
                    <AddEditRecipePage />
                  </PrivateRoute>
                } />
                <Route path="/add-recipe" element={
                  <PrivateRoute>
                    <AddEditRecipePage />
                  </PrivateRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={
                  <PrivateRoute>
                    <FavoritesPage />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App;