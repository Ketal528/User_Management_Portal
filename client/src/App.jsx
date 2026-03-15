import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', age: '', number: '', email: '' });
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
                .then(() => { setEditId(null); fetchUsers(); });
        } else {
            axios.post('http://localhost:3001/createUser', formData)
                .then(() => fetchUsers());
        }
        setFormData({ name: '', age: '', number: '', email: '' });
    };

    const handleDelete = (id) => {
        if(window.confirm("Are you sure?")) {
            axios.delete(`http://localhost:3001/deleteUser/${id}`).then(() => fetchUsers());
        }
    };

    const handleEdit = (user) => {
        setEditId(user._id);
        setFormData({ name: user.name, age: user.age, number: user.number, email: user.email });
    };

    // Inline Styles Objects
    const styles = {
        container: { maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#333' },
        card: { background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '30px' },
        input: { padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
        button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
        deleteBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' },
        editBtn: { padding: '6px 12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
        th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f8f9fa' },
        td: { padding: '12px', borderBottom: '1px solid #eee' }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>User Management Portal</h2>
            
            {/* Form Section */}
            <div style={styles.card}>
                <h3 style={{ marginTop: 0 }}>{editId ? "📝 Edit User" : "👤 Add New User"}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" placeholder="Name" style={styles.input} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        <input type="number" placeholder="Age" style={styles.input} value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                        <input type="text" placeholder="Number" style={styles.input} value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} required />
                        <input type="email" placeholder="Email" style={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <button type="submit" style={{ ...styles.button, backgroundColor: editId ? '#28a745' : '#007bff', width: '100%', marginTop: '10px' }}>
                        {editId ? "Update User Details" : "Save User"}
                    </button>
                </form>
            </div>

            {/* Search Section */}
            <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>🔍 Search:</span>
                <input 
                    type="text" 
                    placeholder="Search by name, email or number..." 
                    style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* Table Section */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Age</th>
                            <th style={styles.th}>Contact Info</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td style={styles.td}><strong>{user.name}</strong></td>
                                <td style={styles.td}>{user.age}</td>
                                <td style={styles.td}>
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>{user.email}</div>
                                    <div style={{ fontSize: '0.8em', color: '#888' }}>{user.number}</div>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(user)} style={styles.editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#999' }}>No users found matching your search.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;