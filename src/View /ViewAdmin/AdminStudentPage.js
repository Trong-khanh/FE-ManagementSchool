import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, InputBase } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { addStudent,GetAllStudent } from "../../AdminAPI";


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function AdminStudentPage() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        className: '',
        parentName: ''
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [showStudentList, setShowStudentList] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=>{
        const fetchListStudent = async () =>{
            try{
                const studentData = await GetAllStudent();
                console.log("list student: ",studentData)
                setShowStudentList(studentData)
            }catch (error){
                console.log("error fetch student", error)
            }
        }
        fetchListStudent()
    },[])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingIndex === null) {
                await addStudent(formData); // Gọi API để thêm sinh viên mới
            } else {
                const updatedStudents = [...students];
                updatedStudents[editingIndex] = formData;
                setStudents(updatedStudents);
                setEditingIndex(null);
            }
            setFormData({
                fullName: '',
                address: '',
                className: '',
                parentName: ''
            });
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleEdit = (index) => {
        setFormData(students[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index) => {
        const updatedStudents = [...students];
        updatedStudents.splice(index, 1);
        setStudents(updatedStudents);
    };

    const toggleStudentList = () => {
        setShowStudentList(!showStudentList);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    return (
        <div>
            <AppBar position="static" sx={{ background: 'linear-gradient(to left top, #fc6c8f, #ff2ced, #ffb86c)' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Student Management
                    </Typography>
                    <Search>
                        <StyledInputBase
                            placeholder="Find…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <SearchIcon />
                    </Search>
                    <IconButton
                        aria-label="more"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        color="inherit"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Link to="/admin/class" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MenuItem onClick={handleClose}>Class</MenuItem>
                        </Link>
                        <Link to="/admin/parent" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MenuItem onClick={handleClose}>Parent</MenuItem>
                        </Link>
                        <Link to="/admin/teacher" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MenuItem onClick={handleClose}>Teacher</MenuItem>
                        </Link>
                        <Link to="/admin/semester" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MenuItem onClick={handleClose}>Semester</MenuItem>
                        </Link>
                        <Link to="/admin/course-fee" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MenuItem onClick={handleClose}>Course Fee</MenuItem>
                        </Link>
                    </Menu>
                </Toolbar>
            </AppBar>
            <div style={{ width: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', background: 'linear-gradient(to right top, #82aaff 50%, #3d6ef7' }}>
                <h2 style={{ textAlign: 'center' }}>Add Student</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="fullName" style={{ fontWeight: 'bold' }}>Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '5px' }}
                            placeholder="Enter full name"
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="address" style={{ fontWeight: 'bold' }}>Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '5px' }}
                            placeholder="Enter address"
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="className" style={{ fontWeight: 'bold' }}>Class Name:</label>
                        <input
                            type="text"
                            id="className"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '5px' }}
                            placeholder="Enter class name"
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="parentName" style={{ fontWeight: 'bold' }}>Parent Name:</label>
                        <input
                            type="text"
                            id="parentName"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '5px' }}
                            placeholder="Enter parent name"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            backgroundImage: 'linear-gradient(to right, #43a047, #66bb6a)'
                        }}
                    >
                        {editingIndex !== null ? 'Save' : 'Add Student'}
                    </button>
                </form>
                <button
                    onClick={toggleStudentList}
                    style={{
                        padding: '10px',
                        marginTop: '10px',
                        backgroundColor: '#673ab7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {showStudentList ? 'Hide Student List' : 'View All Students'}
                </button>
            </div>

            {showStudentList && (
                <div style={{ width: '800px', margin: '20px auto', overflowY: 'auto', maxHeight: '400px' }}>
                    <h2>Information Of Student</h2>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                        <tr style={{
                            backgroundColor: '#f2f2f2',
                            background: 'linear-gradient(to right, #0099ff, #00cc99)',
                            color: 'white'
                        }}>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Full Name</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Address</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Class Name</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Parent Name</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showStudentList.map((student, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{student.fullName}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{student.address}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{student.class.className}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{student.parent.parentName}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>
                                    <IconButton onClick={() => handleEdit(index)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminStudentPage;
