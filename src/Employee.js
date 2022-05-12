import React, {Component} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {PacmanLoader} from "react-spinners";


class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            employees: [],
            deleteModal: false,
            selectedId: '',
            selectedItem: {},
            isLoading: true,
            saveLoading: false
        }
    }

    componentDidMount() {
        axios.get("https://nimadir.herokuapp.com/api/employee")
            .then((res) => {
                console.log(res);
                this.setState({
                    employees: res.data.object,
                    isLoading: false
                })
            })
    }

    render() {

        const changeModal = () => {
            this.setState({
                open: !this.state.open
            })
        }

        const changeDeleteModal = () => {
            this.setState({
                deleteModal: !this.state.deleteModal
            })
        }

        const changeHandler = (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        const saveEmployee = (e) => {
            e.preventDefault();
            this.setState({
                saveLoading: true
            })
            if (this.state.selectedItem.id){
                axios.put("https://nimadir.herokuapp.com/api/employee/" + this.state.selectedItem.id, this.state)
                    .then((res) => {
                        getEmployee();
                        changeModal();
                        this.setState({
                            selectedItem: {}
                        })
                        toast.success(res.data.message);
                    })
            } else {
                axios.post("https://nimadir.herokuapp.com/api/employee", this.state)
                    .then((res) => {
                        getEmployee();
                        changeModal();
                        toast.success(res.data.message);
                    })
                    .catch((error) => {
                        toast.error("Xatolik!!!");
                    })
                    .finally(() => {
                        this.setState({
                            saveLoading: false
                        })
                    })
            }
        }


        const deleteEmployee = (id) => {
            this.setState({
                selectedId: id
            })
            changeDeleteModal();
        }

        const deleteEmployeeOriginal = () => {
            axios.delete("https://nimadir.herokuapp.com/api/employee/" + this.state.selectedId)
                .then((res) => {
                    getEmployee();
                    changeDeleteModal();
                    toast.success(res.data.message);
                })
        }

        const editEmployee = (item) => {
            this.setState({
                selectedItem: item
            })
            changeModal();
        }

        const getEmployee = () => {
            axios.get("https://nimadir.herokuapp.com/api/employee")
                .then((res2) => {
                    this.setState({
                        employees: res2.data.object
                    })
                })
        }
        return (
            <div className="container">

                <div className="loader">
                    {this.state.isLoading ?
                        <PacmanLoader color="#36D7B7" loading={this.state.isLoading}/>
                        : ""}
                </div>

                <div className="row">
                    <div className="col-12">
                        <button type="button" className="btn btn-success ml-auto mt-5 d-block" onClick={changeModal}>Add</button>
                    </div>

                    {this.state.employees.map((item, index) => {
                        return (
                            <div className="col-4 mt-3" key={item.id}>
                                <div className="card">
                                    <div className="card-header">
                                        <h4>{item.firstName + " " + item.lastName}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p>Age: <b>{item.age}</b></p>
                                        <p>Salary: <b>{item.salary}$</b></p>
                                        <p>Position: <b>{item.position}</b></p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-success" onClick={() => editEmployee(item)}>Edit</button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteEmployee(item.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Modal isOpen={this.state.open} toggle={changeModal}>
                    <ModalHeader>
                        <h4>Add Employee</h4>
                    </ModalHeader>
                    <form onSubmit={saveEmployee}>
                        <ModalBody>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Firstname"
                                name="firstName"
                                onChange={changeHandler}
                            />
                            <input
                                type="text"
                                className="form-control mt-3"
                                placeholder="Lastname"
                                name="lastName"
                                onChange={changeHandler}
                            />
                            <input
                                type="number"
                                className="form-control mt-3"
                                placeholder="Age"
                                name="age"
                                onChange={changeHandler}
                            />
                            <input
                                type="number"
                                className="form-control mt-3"
                                placeholder="Salary"
                                name="salary"
                                onChange={changeHandler}
                            />
                            <select name="position" className="form-control mt-3" onChange={changeHandler}>
                                <option value="CEO">CEO</option>
                                <option value="Manager">Manager</option>
                                <option value="Programmer">Programmer</option>
                                <option value="Security">Security</option>
                            </select>
                        </ModalBody>
                        <ModalFooter>
                            <button type="submit" className="btn btn-success" disabled={this.state.saveLoading}>Save</button>
                            <button type="button" className="btn btn-secondary" onClick={changeModal}>Cancel</button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.deleteModal} toggle={changeDeleteModal}>
                    <ModalBody>
                        <h3>Rostdan ham o'chirmoqchimisiz?</h3>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={deleteEmployeeOriginal}>Ha</button>
                        <button type="button" className="btn btn-secondary" onClick={changeDeleteModal}>Yo'q</button>
                    </ModalFooter>
                </Modal>

                <ToastContainer autoClose={1000}/>
            </div>
        );
    }
}

export default Employee;