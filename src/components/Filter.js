import React, { Component } from 'react';
import {connect} from "react-redux";
import jp from 'jsonpath';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false
        };
    }

    componentDidUpdate() {
        if (this.props.data !== null) {
            this.setState({
                showComponent: true
            })
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.showComponent !== nextState.showComponent || this.props.data !== nextProps.data;
    }

    /**
     * Input change event
     */
    handleChange() {
        let inputValue = this.textInput.value;
        let filteredValues = [];

        try {
            filteredValues = jp.nodes(this.props.data, inputValue);
        } catch(e) {
            console.log('Entered expression incorrect')
        }

        this.props.onFilteredDataUpload(filteredValues);
    }

    render() {
        let style = {
          display: this.state.showComponent ? 'flex' : 'none'
        };

        return (
            <div className="filter" style={style}>
                <input onChange={() => this.handleChange()} ref={(input) => this.textInput = input} type="text" id="file" placeholder="Enter JSONPath query, ex: $..book[?(@.price<10)]" />
            </div>
        )
    }
}

export default connect((state, ownProps) => ({
        ownProps,
        data: state.JSONData
    }),
    dispatch => ({
        onFilteredDataUpload: (data) => {
            dispatch({type: 'FILTERED_DATA_UPDATE', payload: data});
        }
    }))(Filter);
