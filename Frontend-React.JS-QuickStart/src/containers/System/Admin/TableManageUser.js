import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
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
        this.props.deleteUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    }

    render() {
        console.log('check user redux: ', this.props.ListUsers);
        console.log('check user state: ', this.state.userRedux);
        let arrUsers = this.state.userRedux;
        return (
            <table id="customers">
                <tbody>
                    {/* Tiêu đề các cột giữ nguyên */}
                    <tr>
                        <th>Email</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>

                    {/* Dùng map() để lặp qua mảng và in ra từng hàng dữ liệu */}
                    {arrUsers && arrUsers.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.address}</td>
                                <td>
                                    <button className="btn-edit">
                                        <i className="fas fa-pencil-alt"
                                            onClick={() => this.handleEditUser(item)}
                                        ></i>
                                    </button>
                                    <button className="btn-delete">
                                        <i className="fas fa-trash"
                                            onClick={() => this.handleDeleteUser(item)}></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
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
