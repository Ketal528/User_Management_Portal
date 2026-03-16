import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', age: '', number: '', email: '', password: '' });
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // --- New States for Login Logic ---
    const [view, setView] = useState('signup'); // 'signup', 'login', or 'dashboard'
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3001/').then(res => setUsers(res.data));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.number.includes(searchTerm)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            axios.put(`http://localhost:3001/updateUser/${editId}`, formData)
                .then(() => { 
                    setEditId(null); 
                    fetchUsers(); 
                    alert("User updated successfully!");
                });
        } else {
            axios.post('http://localhost:3001/createUser', formData)
                .then(() => {
                    fetchUsers();
                    alert("Registration successful! Please login.");
                    setView('login'); // Switch to login view after adding user
                });
        }
        setFormData({ name: '', age: '', number: '', email: '', password: '' });
    };

    // --- New Login Handler ---
    const handleLogin = (e) => {
        e.preventDefault();
        // Simple client-side check against the fetched users list
        const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
        
        if (user) {
            setLoggedInUser(user);
            setView('dashboard');
        } else {
            alert("Invalid email or password");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) {
            axios.delete(`http://localhost:3001/deleteUser/${id}`).then(() => fetchUsers());
        }
    };

    const handleEdit = (user) => {
        setEditId(user._id);
        setFormData({ name: user.name, age: user.age, number: user.number, email: user.email, password: user.password });
        setView('signup'); // Go back to form to edit
    };

    const styles = {
        container: { maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: '"Segoe UI", sans-serif', color: '#333' },
        card: { background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '30px' },
        input: { padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
        button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
        deleteBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' },
        editBtn: { padding: '6px 12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
        th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f8f9fa' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        nav: { textAlign: 'center', marginBottom: '20px' }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>User Management System</h2>

            {/* Navigation toggle */}
            {view !== 'dashboard' && (
                <div style={styles.nav}>
                    <button onClick={() => setView('signup')} style={{...styles.button, marginRight: '10px', backgroundColor: view === 'signup' ? '#0056b3' : '#6c757d'}}>Sign Up</button>
                    <button onClick={() => setView('login')} style={{...styles.button, backgroundColor: view === 'login' ? '#0056b3' : '#6c757d'}}>Login</button>
                </div>
            )}

            {/* View 1: Sign Up / Add User */}
            {view === 'signup' && (
                <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>{editId ? "📝 Edit User" : "👤 Register New User"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input type="text" placeholder="Name" style={styles.input} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="number" placeholder="Age" style={styles.input} value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                            <input type="text" placeholder="Number" style={styles.input} value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
                            <input type="email" placeholder="Email" style={styles.input} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            <input type="password" placeholder="Password" style={styles.input} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                        </div>
                        <button type="submit" style={{ ...styles.button, backgroundColor: editId ? '#28a745' : '#007bff', width: '100%', marginTop: '10px' }}>
                            {editId ? "Update User Details" : "Register"}
                        </button>
                    </form>
                </div>
            )}

            {/* View 2: Login */}
            {view === 'login' && (
                <div style={{...styles.card, maxWidth: '400px', margin: '0 auto'}}>
                    <h3 style={{ marginTop: 0 }}>🔑 Login</h3>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="Email" style={styles.input} value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                        <input type="password" placeholder="Password" style={styles.input} value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                        <button type="submit" style={{ ...styles.button, width: '100%' }}>Login</button>
                    </form>
                </div>
            )}

            {/* View 3: Dashboard (Table & Search) */}
            {view === 'dashboard' && (
                <>
                    <div style={{...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Welcome, <strong>{loggedInUser?.name}</strong>!</span>
                        <button onClick={() => setView('login')} style={styles.deleteBtn}>Logout</button>
                    </div>

                    <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: 'bold' }}>🔍 Search:</span>
                        <input type="text" placeholder="Search..." style={{ ...styles.input, marginBottom: 0, flex: 1 }} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Contact Info</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td style={styles.td}><strong>{user.name}</strong></td>
                                        <td style={styles.td}>{user.email}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => handleEdit(user)} style={styles.editBtn}>Edit</button>
                                            <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;