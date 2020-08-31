import React, { Component } from 'react';
import { connect } from 'react-redux';
import Uploader from './Uploader.js';
import Filter from './Filter.js';
import Viewer from './Viewer.js';

class JSONPathVisualizerMain extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="main-label">JSONPath Visualizer</div>
                <div className="uploader-filter">
                    <Uploader />
                    <Filter />
                </div>
                <Viewer />
            </div>
        )
    }
}

export default connect((state, ownProps) => ({
        ownProps,
        data: state.JSONData
    }),
    dispatch => ({
    }))(JSONPathVisualizerMain);
