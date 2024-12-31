import IndexPage from '@/pages/index'

import { LoginPage } from '@/pages/login'
import { Route, Routes } from 'react-router-dom'

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<LoginPage />} path="/login" />
		</Routes>
	)
}

export default App
