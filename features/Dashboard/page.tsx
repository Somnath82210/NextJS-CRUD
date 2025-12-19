import DashboardPage from "./main/Dashboard"
import ProtectedRoute from '@/components/protected/ProtectedRoute';

export default function Dashboard(){

    return (
        <div>
            <ProtectedRoute>
            <DashboardPage/>
            </ProtectedRoute>
        </div>
    )
}