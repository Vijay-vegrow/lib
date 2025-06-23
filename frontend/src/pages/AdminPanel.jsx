import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm'; 
import {
  addAdmin,
  approveLibrarian,
  fetchApprovedLibrarians,
  fetchPendingLibrarians,
  deleteLibrarian,
  fetchAllUsers,
  deleteUser
} from '../api';
import FlexTable from '../components/FlexTable';
import TimedMessage from '../components/TimedMessage';

function DeleteConsentModal({ open, onCancel, onConfirm, librarian }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: '2rem', borderRadius: 10, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.18)'
      }}>
        <h3>Delete Librarian</h3>
        <p>Are you sure you want to delete librarian <b>{librarian?.email}</b>?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <button onClick={onCancel} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #aaa', background: '#f5f5f5' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #b71c1c', background: '#ffcdd2', color: '#b71c1c' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  // Admin/librarian management
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [adminMsg, setAdminMsg] = useState('');
  const [msgKey, setMsgKey] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [librarianToDelete, setLibrarianToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchPendingLibrarians().then(setPending);
    fetchApprovedLibrarians().then(setApproved);
    fetchAllUsers().then(setUsers);
  }, []);

  // Update message with key for TimedMessage
  const showAdminMsg = (msg) => {
    setAdminMsg('');
    setTimeout(() => {
      setMsgKey(prev => prev + 1);
      setAdminMsg(msg);
    }, 20);
  };

  const handleAddAdmin = async (values, { resetForm }) => {
    try {
      const res = await addAdmin(values.email, values.password);
      showAdminMsg(res.message);
      resetForm();
    } catch (err) {
      showAdminMsg('Error creating admin');
    }
  };

  const handleApprove = async (id) => {
    await approveLibrarian(id);
    setPending(pending.filter(l => l.id !== id));
    fetchApprovedLibrarians().then(setApproved);
  };

  const handleDelete = (librarian) => {
    setLibrarianToDelete(librarian);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!librarianToDelete) return;
    deleteLibrarian(librarianToDelete.id)
      .then(() => {
        setApproved(approved.filter(l => l.id !== librarianToDelete.id));
        showAdminMsg('Librarian deleted successfully.');
      })
      .catch(err => {
        showAdminMsg('Error deleting librarian');
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setLibrarianToDelete(null);
      });
  };

  const handleUserDelete = (user) => {
    setUserToDelete(user);
    setUserDeleteModalOpen(true);
  };

  const confirmUserDelete = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id)
      .then(() => {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        showAdminMsg('User deleted successfully.');
      })
      .catch(async (err) => {
        let msg = 'Error deleting user';
        // Try to extract backend error message
        if (err.response && err.response.data && err.response.data.error) {
          msg = err.response.data.error;
        } else if (err.message) {
          msg = err.message;
        }
        showAdminMsg(msg);
      })
      .finally(() => {
        setUserDeleteModalOpen(false);
        setUserToDelete(null);
      });
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
      />
      <TimedMessage key={msgKey} message={adminMsg} onClose={() => setAdminMsg('')} />
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
        actions={row => (
          <button
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        )}
      />

      <h2 style={{ marginTop: '2rem',display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px' }}>All Users</h2>
      <FlexTable
        columns={[
          { header: 'Email', accessor: 'email' },
          { header: 'Joined in', accessor: row => new Date(row.created_at).toLocaleString() }
        ]}
        data={users}
        emptyMessage="No users"
        getRowKey={row => row.id}
        actions={row => (
          <button onClick={() => handleUserDelete(row)}>Delete</button>
        )}
      />

      <DeleteConsentModal
        open={deleteModalOpen}
        onCancel={() => { setDeleteModalOpen(false); setLibrarianToDelete(null); }}
        onConfirm={confirmDelete}
        librarian={librarianToDelete}
      />

      <DeleteConsentModal
        open={userDeleteModalOpen}
        onCancel={() => { setUserDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={confirmUserDelete}
        librarian={userToDelete}
      />
    </div>
  );
}