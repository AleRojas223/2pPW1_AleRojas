import { useEffect, useState } from "react";
import api from "../libs/api";

interface ItemInterface {
  id: number;
  name: string;
  price: number;
}

const Ale = () => {
  const [productList, setProductList] = useState<ItemInterface[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProductList(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, price: parseFloat(price) };

    try {
      if (editingId !== null) {
        await api.put(`/products/${editingId}`, data);
      } else {
        await api.post("/products", data);
      }
      setName("");
      setPrice("");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEdit = (item: ItemInterface) => {
    setName(item.name);
    setPrice(item.price.toString());
    setEditingId(item.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 neon-text">
        ABM Productos Ale Rojas
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda - Formulario de gestión */}
        <div className="lg:w-1/3">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30 hover:shadow-blue-200/50 transition-shadow duration-300 sticky top-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              {editingId !== null ? "Editar Producto" : "Agregar Producto"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-blue-600 mb-1">Nombre</label>
                <input
                  className="w-full p-3 rounded-lg border-2 border-blue-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/50 outline-none transition-all bg-white/80"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-blue-600 mb-1">Precio</label>
                <input
                  className="w-full p-3 rounded-lg border-2 border-blue-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/50 outline-none transition-all bg-white/80"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-400/30 transition-all hover:scale-[1.02] active:scale-95 flex-1"
                >
                  {editingId !== null ? "Actualizar" : "Agregar"}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-cyan-600 hover:text-cyan-800 transition-colors"
                    onClick={() => {
                      setName("");
                      setPrice("");
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Columna derecha - Lista de productos */}
        <div className="lg:w-2/3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/30">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Lista de Productos</h2>
            
            {productList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-blue-400/80">No hay productos registrados</p>
                <p className="text-blue-300 mt-2">Agrega tu primer producto usando el formulario</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productList.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl shadow-sm p-4 border border-white/50 hover:shadow-blue-200/30 hover:border-cyan-200/50 transition-all duration-300 group"
                  >
                    <h3 className="font-bold text-lg text-blue-700 mb-1 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-cyan-500 font-medium mb-3">{product.price.toFixed(0)} Gs</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm rounded-md bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ale;