import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deletePoll } from '../services/pollService';
import './AdminViewPollDataGrid.scss';
const AdminViewPollDataGrid = (props: any) => {
    console.log(props);
    const [clickedRow, setClickedRow] = React.useState();
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [showMessage, setShowMessage] = useState(false);

    const navigate = useNavigate();

    const handleResultView = (event: any, pollId: string) => {
        navigate(`/result/${pollId}`);
    };

    const handleEditView = (event: any, privateId: string) => {
        console.log(privateId);
        // PrivateID : bc1a638d-8c2b-4403-8f53-3b22e30e8b1e
        navigate(`/admin/polledit/${privateId}`);
    };

    const onDelete = (event: any, row: any) => {
        event.stopPropagation();
        setClickedRow(row);
    };

    const handleDelete = (event: any, pollId: string) => {
        // deletePoll(pollId).
        deletePoll(pollId)
            .then((response) => {
                if (response.success) {
                    props.showNotification({
                        severity: 'success',
                        message: 'Poll deleted successfully'
                    });
                } else {
                    props.showNotification({
                        severity: 'error',
                        message: 'Error occured while deleting poll'
                    });
                }
            })
            .catch((error) => {
                props.showNotification({
                    severity: 'error',
                    message: 'Error occured while deleting poll'
                });
            });
    };

    const handleCopyLink = async (event: any, pollId: string) => {
        const pollAnsweringUrl = `${window.location.origin}/result/${pollId}`;
        await navigator.clipboard.writeText(pollAnsweringUrl); //**currently copying result page link - to be replaced with answering url
        setShowMessage(true);
        //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 400);
        event.stopPropagation();
    };

    const columnData = [
        { field: 'name', headerName: 'Poll Name', flex: 1 },
        {
            field: 'actionsField',
            headerName: 'Actions',
            description: 'Actions column.',
            sortable: false,
            flex: 2,
            renderCell: (params: any) => {
                return (
                    <div className="actions-wrapper">
                        <Link
                            className="pinkLink"
                            onClick={(e) =>
                                handleEditView(e, params.row.privateId)
                            }
                        >
                            Edit poll
                        </Link>
                        <Link
                            className="pinkLink"
                            onClick={(e) => handleResultView(e, params.row.id)}
                        >
                            View results
                        </Link>
                        <Link
                            className="pinkLink"
                            onClick={(e) => handleCopyLink(e, params.row.id)}
                        >
                            Copy answering link
                        </Link>
                        <Link
                            className="deleteLink"
                            onClick={(e) => handleDelete(e, params.row.id)}
                        >
                            Delete
                        </Link>
                    </div>
                );
            }
        }
    ];

    const rowData = props.data.map((row: any) => ({
        name: row.name,
        id: row.publicId,
        privateId: row.privateId
    }));

    return (
        <div
            className="dataGridWrapper"
            style={{ width: '50rem', height: '23rem' }}
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

export default AdminViewPollDataGrid;
