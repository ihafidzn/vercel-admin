import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./admin-style.css";
import Navbar from "../../component/Navbar/navbar";

import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_REACT_APP_ADMIN_GET)
      .then((users) => setUsers(users.data))
      .catch((err) => console.log(err));
  }, []);

  //   email: "",
  //   password: "",
  //   passwordConfirm: "",
  // });
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [passwordConfirm, setPasswordConfirm] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const localCreatedAt = currentDate.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });
    if (password !== passwordConfirm) {
      alert("Password and Password Confirmation must match");
      return;
    }
    axios
      .post(import.meta.env.VITE_REACT_APP_ADMIN_POST, {
        email,
        password,
        passwordConfirm,
        createdAt: localCreatedAt,
      })
      .then((result) => console.log(result));
    axios
      .get(import.meta.env.VITE_REACT_APP_ADMIN_GET)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((err) => console.log(err));

    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    alert("tombol submit ditekan");
  };

  return (
    <>
      <Navbar />
      <section className="container module-header">
        <div className="header-root">
          <h2>ADMIN CONTROL</h2>
        </div>
        <div>
          <form action="" onSubmit={handleSubmit}>
            <Accordion>
              <AccordionSummary
                id="panel1-header"
                aria-control="panel1-content"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography className="fw-bolder">Create New Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="form-group row required">
                    <label for="Email" class="col-sm-3 col-form-label">
                      Email
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g:admin@admin.com"
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      for="inputPassword"
                      className="col-sm-3 col-form-label"
                    >
                      Password
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="e.g:***123***"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="inputPasswordConfirm"
                      className="col-sm-3 col-form-label"
                    >
                      Password Confirmation
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        placeholder="e.g:***123***"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor=""
                      className="col-sm-3 col-form-label"
                    ></label>
                    <div className="col-sm-9">
                      <button className="btn btn-primary text-light">
                        Submit
                      </button>
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </form>
          <Accordion>
            <AccordionSummary
              id="panel1-header"
              aria-control="panel1-content"
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography className="fw-bold">Data Table</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((data) => {
                      return (
                        <tr>
                          <td>{data.email}</td>
                          <td>{data.createdAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.age}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
