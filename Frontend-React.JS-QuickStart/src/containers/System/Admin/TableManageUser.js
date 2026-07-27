import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.ListUsers !== this.props.ListUsers) {
            this.setState({
                userRedux: this.props.ListUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            this.props.deleteUserRedux(user.id);
        }
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    }

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <div className="table-manage-user-container">
                <table id="customers">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>Họ</th>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Hành động</th>
                        </tr>

                        {arrUsers && arrUsers.length > 0 && arrUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.phonenumber || item.phoneNumber || '-'}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => this.handleEditUser(item)} title="Sửa thông tin">
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn-delete" onClick={() => this.handleDeleteUser(item)} title="Xóa người dùng">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ListUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUser()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
