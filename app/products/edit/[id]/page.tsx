import EditProductPage from "@/features/products/editProduct/EditProduct";
import ProtectedRoute from "@/components/protected/ProtectedRoute";

export default function EditProduct() {
  return (
    <div>
      <ProtectedRoute>
        <EditProductPage />
      </ProtectedRoute>
    </div>
  );
}