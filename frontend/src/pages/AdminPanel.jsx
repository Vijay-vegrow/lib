import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import {
  addAdmin,
  approveLibrarian,
  fetchApprovedLibrarians,
  fetchPendingLibrarians
} from '../api';
import FlexTable from '../components/FlexTable';

export default function AdminPanel() {
  // Admin/librarian management
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [adminMsg, setAdminMsg] = useState('');

  useEffect(() => {
    fetchPendingLibrarians().then(setPending);
    fetchApprovedLibrarians().then(setApproved);
  }, []);

  const handleAddAdmin = async (values, { resetForm }) => {
    try {
      const res = await addAdmin(values.email, values.password);
      setAdminMsg(res.message);
      resetForm();
    } catch (err) {
      setAdminMsg('Error creating admin');
    }
  };

  const handleApprove = async (id) => {
    await approveLibrarian(id);
    setPending(pending.filter(l => l.id !== id));
    fetchApprovedLibrarians().then(setApproved);
  };

  const adminFields = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2 style={{ display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Add New Admin</h2>
      <AuthForm
        initialValues={{ email: '', password: '' }}
        onSubmit={handleAddAdmin}
        fields={adminFields}
        buttonLabel="Add Admin"
        message={adminMsg}
      />
      {adminMsg && <div className="message">{adminMsg}</div>}

      <h2 style={{ marginTop: '2rem',display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px' }}>Pending Librarians</h2>
      <FlexTable
        columns={[{ header: 'Email', accessor: 'email' }]}
        data={pending}
        emptyMessage="No pending librarians"
        getRowKey={row => row.id}
        actions={row => (
          <button onClick={() => handleApprove(row.id)}>Approve</button>
        )}
      />

      <h2 style={{ marginTop: '2rem',display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px' }}>Approved Librarians</h2>
      <FlexTable
        columns={[{ header: 'Email', accessor: 'email' }]}
        data={approved}
        emptyMessage="No approved librarians"
        getRowKey={row => row.id}
      />
    </div>
  );
}