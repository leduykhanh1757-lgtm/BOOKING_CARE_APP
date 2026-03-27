import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';

class ModelEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '', // ĐÃ THÊM VÀO STATE
            roleId: '',
            gender: '',
            positionId: '',
        }
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '', password: '', firstName: '', lastName: '', address: '', phoneNumber: '', roleId: 'R1', gender: '1', positionId: 'P0'
            })
        })
    }

    componentDidMount() {
        let user = this.props.currentuser;
        if (user && !_.isEmpty(user)) {
            let genderState = '1'; // Mặc định Nam
            if (user.gender === 0 || user.gender === '0' || user.gender === false) {
                genderState = '0'; // Bắt chuẩn Nữ
            }
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hashcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phoneNumber: user.phoneNumber,
                roleId: user.roleId,
                gender: genderState,
                positionId: user.positionId,
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.editUser(this.state);
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={() => this.toggle()} className={'modal-user-container'} size="lg" centered>
                <ModalHeader toggle={() => this.toggle()}>Edit a user</ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'email')} value={this.state.email} disabled />
                            </div>
                            <div className="col-6 form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'password')} value={this.state.password} disabled />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6 form-group">
                                <label>First Name</label>
                                <input type="text" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'firstName')} value={this.state.firstName} />
                            </div>
                            <div className="col-6 form-group">
                                <label>Last Name</label>
                                <input type="text" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'lastName')} value={this.state.lastName} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 form-group">
                                <label>Address</label>
                                <input type="text" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'address')} value={this.state.address} />
                            </div>
                        </div>

                        {/* ĐÃ CHIA ĐỀU 4 CỘT: PHONE, SEX, ROLE, POSITION ĐỂ KHÔNG BỊ MISSING DATA */}
                        <div className="row mt-3">
                            <div className="col-3 form-group">
                                <label>Phone Number</label>
                                <input type="text" className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} value={this.state.phoneNumber} />
                            </div>
                            <div className="col-3 form-group">
                                <label>Sex</label>
                                <select className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'gender')} value={this.state.gender}>
                                    <option value="1">Male</option>
                                    <option value="0">Female</option>
                                </select>
                            </div>
                            <div className="col-3 form-group">
                                <label>Role</label>
                                <select className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'roleId')} value={this.state.roleId}>
                                    <option value="R1">Admin</option>
                                    <option value="R2">Doctor</option>
                                    <option value="R3">Patient</option>
                                </select>
                            </div>
                            <div className="col-3 form-group">
                                <label>Position</label>
                                <select className="form-control" onChange={(event) => this.handleOnChangeInput(event, 'positionId')} value={this.state.positionId}>
                                    <option value="P0">None</option>
                                    <option value="P1">Master</option>
                                    <option value="P2">Doctor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSaveUser()}>Save changes</Button>{' '}
                    <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(ModelEditUser);