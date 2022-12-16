import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { deleteUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import './AdminViewDataGrid.scss';

const AdminViewUserDataGrid = (props: any) => {
    const [pageSize, setPageSize] = React.useState<number>(5);
    const navigate = useNavigate();

    const showSnackBar = (status: { severity: string; message: string }) => {
        props.showNotification({
            severity: status.severity,
            message: status.message
        });
    };

    const handleEdit = (rowData: any) => {
        navigate(`edit`, {
            state: {
                user: rowData.username,
                id: rowData.id,
                isAdmin: rowData.isAdmin
            }
        });
    };

    const handleDelete = (userId: string) => {
        deleteUser(userId).then((response) => {
            if (response.success) {
                showSnackBar({
                    severity: 'success',
                    message: 'User deleted successfully'
                });
            } else {
                showSnackBar({
                    severity: 'error',
                    message: 'Error occured while deleting user'
                });
            }
        });
    };

    const columnData = [
        { field: 'username', headerName: 'Username', flex: 1 },
        {
            field: 'actionsField',
            headerName: 'Actions',
            description: 'Actions column.',
            sortable: false,
            flex: 2,
            renderCell: (params: any) => {
                return (
                    <div className="actions-wrapper extra-gap">
                        <Link
                            className="pinkLink"
                            onClick={(e) => handleEdit(params.row)}
                        >
                            Edit user
                        </Link>
                        <Link
                            className="deleteLink"
                            onClick={(e) => handleDelete(params.row.id)}
                        >
                            Delete
                        </Link>
                    </div>
                );
            }
        }
    ];

    const rowData = props.data.map((row: any) => ({
        email: row.email,
        fname: row.firstName,
        lname: row.lastName,
        id: row.id,
        isAdmin: row.isAdmin,
        password: row.password,
        username: row.userName
    }));

    return (
        <div
            className="dataGridWrapper"
            style={{ width: '35rem', height: '23rem' }}
        >
            <DataGrid
                columns={columnData}
                rows={rowData}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15]}
                disableSelectionOnClick
            />
        </div>
    );
};

export default AdminViewUserDataGrid;
