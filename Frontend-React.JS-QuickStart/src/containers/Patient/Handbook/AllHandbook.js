import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllHandbook.scss';
import { getAllHandbook } from '../../../services/userService';

const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    const safeText = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
    return safeText.trim() + '...';
};

class AllHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: []
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : []
            });
        }
    }

    handleViewDetailHandbook = (handbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbook.id}`);
        }
    }

    render() {
        let { dataHandbooks } = this.state;

        return (
            <div className="all-handbook-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-handbook-body">
                    <div className="all-handbook-content">
                        <div className="title-section">Cẩm nang y tế</div>

                        <div className="list-handbook">
                            {dataHandbooks && dataHandbooks.length > 0 &&
                                dataHandbooks.map((item, index) => {
                                    return (
                                        <div
                                            className="handbook-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="handbook-name" title={item.name}>
                                                {truncateText(item.name, 65)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(AllHandbook);