import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import TaskBoard from './pages/TaskBoard'
import TaskDetails from './pages/TaskDetails'
import { useEffect, useState } from 'react'

function App() {

  /*
    Get the saved theme.

    If there isn't one yet, default to dark.
  */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })


  /*
    Apply theme to the root HTML element.

    index.css uses:

    [data-theme="light"] { ... }

    so this is what actually switches
    the CSS variables.
  */
  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    )

    localStorage.setItem(
      'theme',
      theme
    )

  }, [theme])


  /*
    Toggle between dark and light.
  */
  const toggleTheme = () => {

    setTheme(currentTheme =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark'
    )

  }


  return (
    <AppProvider>

      <BrowserRouter>

        <Routes>

          {/* Task Board */}
          <Route
            path="/"
            element={
              <TaskBoard
                toggleTheme={toggleTheme}
                theme={theme}
              />
            }
          />

          {/* Task Details */}
          <Route
            path="/task/:id"
            element={<TaskDetails />}
          />

        </Routes>

      </BrowserRouter>

    </AppProvider>
  )
}

export default App