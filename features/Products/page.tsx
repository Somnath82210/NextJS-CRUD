import ProductTable from "./producttable/ProductsTable"
import ProtectedRoute from "@/components/protected/ProtectedRoute";
export default function Products(){

    return (
        <div>
            <ProtectedRoute>
            <ProductTable/>
            </ProtectedRoute>
        </div>
    )
}