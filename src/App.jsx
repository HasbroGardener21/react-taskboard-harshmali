import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import TaskBoard from './pages/TaskBoard'
import TaskDetails from './pages/TaskDetails'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskBoard />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App