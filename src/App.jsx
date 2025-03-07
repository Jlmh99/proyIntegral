// Importamos los hooks de React y las funciones necesarias de Firebase Firestore 
import {
    addDoc,
    collection, // Para obtener documentos de una colección en Firestore
    deleteDoc, // Para eliminar un documento de Firestore
    doc, // Para agregar un nuevo documento a Firestore
    getDocs, // Para hacer referencia a un documento específico en Firestore 
    updateDoc // Para actualizar un documento en Firestore
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "./firebaseConfig"; // Importamos la configuración de Firebase 

// Importamos Chart.js para la generación de reportes en gráficos 
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Title
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registramos los componentes necesarios para que funcione Chart.js 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function App() {
// Definimos los estados para el formulario y los datos de la base de datos 
const [name, setName] = useState(""); // Estado para el nombre
const [age, setAge] = useState(""); // Estado para la edad
const [users, setUsers] = useState([]); // Estado para la lista de usuarios
const [editingId, setEditingId] = useState(null); // Estado para controlar la edición de un usuario

// Función para obtener los usuarios de Firebase Firestore
const fetchUsers = async () => {
    const querySnapshot = await getDocs (collection (db, "users")); // obtener todos los documentos de la colección "users" 
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); // Guardamos los datos en el estado
};

// Función para agregar un nuevo usuario a Firebase Firestore
const adduser = async () => {
    if (name.trim() && age.trim()) { // Verificamos que los campos no estén vacíos
        await addDoc (collection (db, "users"), { name, age: Number(age) }); // Agregar documento con nombre y edad 
        setName(""); // Limpiar el campo nombre       
        setAge(""); // Limpiar el campo edad 
        fetchUsers(); // Actualizar la lista de usuarios
    }
};

// Función para actualizar un usuario existente en Firebase Firestore
const updateUser = async () => {
    if (editingId && name.trim() && age.trim()) { // Verificamos que haya un usuario seleccionado y que los campos no estén vacíos 
        await updateDoc(doc(db, "users", editingId), {name, age: Number (age) }); // Actualizar documento en Firestore
        setEditingId(null); // Limpiar el estado de edición
        setName(""); // Limpiar el campo nombre
        setAge(""); // Limpiar el campo edad
        fetchUsers(); // Actualizar la lista de usuarios
    }
};

// Función para eliminar un usuario de Firebase Firestore
const deleteUser = async (id) => {
    await deleteDoc (doc(db, "users", id)); // Eliminar documento de la colección "users" 
    fetchUsers(); // Actualizar la lista de usuarios
};

// Cargar los usuarios cuando se monta el componente 
useEffect(() => { 
    fetchUsers();
}, []);

// Configuración de los datos para el gráfico de barras
const chartData = {
    labels: users.map((user) => user.name), // Nombres de los usuarios como etiquetas en el gráfico 
    datasets: [
        {
        label: "Edad", // Etiqueta del gráfico
        data: users.map((user) => user.age), // Edades de los usuarios como datos del gráfico 
        backgroundColor: "blue", // Color de las barras
        },
    ]
};

return(
    <div style ={{ textAlign: "center",marginTop:"50px"}}>
        <h1>CRUD con Firebase y Reportes</h1>

        {/* Formulario de entrada de datos */}
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
        />
        <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Edad"
        />

        {/* Boton para agregar o actualizar datos */}
        {editingId ? (
            <button onClick={updateUser}>Actualizar</button>
        ) : (
            <button onClick={adduser}>Agregar</button>
        )}

        {/* Lista de usuarios con botones de edicion y eliminacion */}
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    {user.name} - {user.age} años
                    <button onClick={() => { setName(user.name); setAge(user.age); setEditingId(user.id); }}> EDITAR</button>
                    <button onClick={() => deleteUser(user.id)}> BORRAR</button>
                </li>
            ))}
        </ul>

        <h2>Reporte de Edades</h2>
        {/* Grafico de barras con los datos de los usuarios */}
            <Bar data={chartData} />
    </div>
    );
}

export default App;
