'use client';
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Page() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentUser, setCurrentUser] = useState(null); // store the current logged-in user
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Check login status and fetch users if logged in
  async function checkLoginStatus() {
    try {
      const response = await axios.get("/api/auth/session");
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        fetchUsers();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login check failed:", error);
      router.push("/");
    }
  }

  function fetchUsers() {
    axios.get('/api/user').then((response) => {
      setUsers(response.data);
    }).catch((error) => {
      console.error("Error fetching users:", error);
    });
  }

  async function deleteUser(user) {
    if (user.username === currentUser.username) {
      MySwal.fire({
        icon: 'warning',
        title: 'Cannot delete your own account',
        text: 'Please try deleting this account from another admin account.',
      });
      return;
    }

    MySwal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete '${user.username}'`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        cancelButtonText: 'Cancel',
    }).then(async result => {
        if (result.isConfirmed) {
            await axios.delete('/api/user?username=' + user.username);
            fetchUsers();
        }
    });
  }

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-screen h-screen bg-[#F35782] flex flex-col pt-10 pl-64'>
      <div className="form-control w-60">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>
      <div className="w-4/5 mt-10">
        <div className="overflow-x-auto rounded-sm">
          <table className="table rounded-sm text-center">
            <thead className='text-2xl text-white'>
              <tr>
                <th className="bg-pink-600 cursor-pointer" onClick={() => handleSort("username")}>
                  Username {sortField === "username" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="bg-pink-600 cursor-pointer" onClick={() => handleSort("password")}>
                  Password {sortField === "password" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="bg-pink-600 cursor-pointer" onClick={() => handleSort("email")}>
                  Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="bg-pink-600 cursor-pointer" onClick={() => handleSort("nama")}>
                  Nama {sortField === "nama" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="bg-pink-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.email}</td>
                    <td>{user.nama}</td>
                    <td>
                      <Link href={'/dashboard/update/' + user.username}>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-7">Update</button>
                      </Link>
                      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded" onClick={() => deleteUser(user)}>Delete</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
