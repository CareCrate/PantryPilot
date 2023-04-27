import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridEditRowsModel, GridRowId, GridCellEditCommitParams, GridCellParams } from "@mui/x-data-grid";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { SessionUser, WorkspaceUser } from "@/types";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";

const fetchUsers = async (workspaceId: string) => {
  const usersRef = collection(doc(db, "workspaces", workspaceId), "users");
  const querySnapshot = await getDocs(usersRef);
  const users: any[] = [];
  querySnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

const addUser = async (newUser: any, workspaceId: string) => {
  const usersRef = collection(doc(db, "workspaces", workspaceId), "users");
  const docRef = await addDoc(usersRef, newUser);
  return { id: docRef, ...newUser };
};

const updateUser = async (id: string, updatedUser: Partial<WorkspaceUser>, workspaceId: string) => {
  const userRef = doc(db, "workspaces", workspaceId, "users", id);
  await updateDoc(userRef, updatedUser);
};

const deleteUser = async (id: string, workspaceId: string) => {
  const userRef = doc(db, "workspaces", workspaceId, "users", id);
  await deleteDoc(userRef);
};

export default function Settings() {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const workspaceId = user?.workspaceId;
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });

  useEffect(() => {
    if (user?.role === "admin" && workspaceId) {
      fetchUsers(workspaceId).then(fetchedUsers => setUsers(fetchedUsers));
    }
  }, [user, workspaceId]);

  const columns = [
    { field: "name", headerName: "Full Name", width: 250, editable: true },
    { field: "email", headerName: "Email", width: 250, editable: true },
    { field: "password", headerName: "Password", width: 250, editable: true },
    { field: "role", headerName: "Role", width: 150, editable: true },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <Button onClick={() => handleDelete(params.id)} variant="outlined" color="error" size="small">
          Delete
        </Button>
      )
    }
  ];

  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({});

  const handleEditCellChangeCommitted = async (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;

    const originalUser = users.find(user => user.id === id);
    if (!originalUser) return;

    const oldValue = originalUser[field];

    if (field && value !== undefined && value !== oldValue) {
      const updatedUser = { [field]: value };
      if (workspaceId) {
        await updateUser(id as string, updatedUser, workspaceId);
        const updatedUsers = users.map(user => (user.id === id ? { ...user, ...updatedUser } : user));
        setUsers(updatedUsers);
      }
      const updatedEditRowsModel = {
        ...editRowsModel,
        [id]: { ...editRowsModel[id as string], [field]: { value } }
      };
      setEditRowsModel(updatedEditRowsModel);
    }
  };

  const handleDelete = async (id: GridRowId) => {
    if (workspaceId) {
      await deleteUser(id as string, workspaceId);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (workspaceId) {
      const createdUser = await addUser(newUser, workspaceId);
      setUsers([...users, createdUser]);
      setNewUser({ name: "", email: "", password: "", role: "" });
    }
  };

  if (user?.role !== "admin") {
    return <Typography variant="h6">You are not authorized to access this page.</Typography>;
  }

  return (
    <Box component="div" sx={{ overflowX: "clip", position: "relative", margin: "auto", maxWidth: "1920px", padding: "2em" }}>
      <Grid container spacing={0} direction="column" sx={{ width: "100%" }}>
        <Grid item container direction="column" spacing={0} sx={{ flexDirection: "column" }}>
          <Typography component="h3" variant="h3">Settings</Typography>
          <Stack spacing={5}>
            <Box component="div" sx={{ overflowX: "clip", position: "relative", mt: '2em' }}>
              <Typography component="h5" variant="h5">Users Management</Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth id="name" label="Name" name="name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                <TextField margin="normal" required fullWidth id="password" label="Password" name="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <TextField select id="role" label="Role" name="role" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </FormControl>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, textTransform: "none" }}>
                  Add User
                </Button>
              </Box>
              <div style={{ height: 400, width: "100%", marginTop: 16 }}>
                <DataGrid
                  rows={users}
                  columns={columns}
                  pageSize={5}
                  editMode="row"
                  editRowsModel={editRowsModel}
                  onEditRowsModelChange={setEditRowsModel}
                  onCellEditCommit={handleEditCellChangeCommitted} // Change this line
                />
              </div>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
