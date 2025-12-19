import AddProductPage from "@/features/products/addProduct/AddProduct";
import ProtectedRoute from "@/components/protected/ProtectedRoute";

export default function AddProduct() {
  return (
    <div>
      <ProtectedRoute>
        <AddProductPage />
      </ProtectedRoute>
    </div>
  );
}