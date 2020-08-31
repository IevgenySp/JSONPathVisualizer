import React, { Component } from 'react';
import {connect} from "react-redux";

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadName: 'Upload file'
        }
    }

    /**
     * Upload event
     * @param event
     */
    handleChange(event) {
        if (event.target.files[0]) {
            let reader = new FileReader();
            let self = this;
            let name = event.target.files[0].name;

            reader.readAsText(event.target.files[0]);

            reader.onload = function () {
                self.props.onDataUpload(JSON.parse(reader.result));

                self.setState({
                    uploadName: name
                })
            };

            reader.onerror = function () {
                console.log(reader.error);
            };
        }
    }

    render() {
        return (
            <div className="uploader">
                <input type="file" id="file" onChange={this.handleChange.bind(this)}/>
                <label htmlFor="file">{this.state.uploadName}</label>
            </div>
        )
    }
}

export default connect((state, ownProps) => ({
        ownProps,
        data: state.JSONData
    }),
    dispatch => ({
        onDataUpload: (data) => {
            dispatch({type: 'JSON_DATA_UPDATE', payload: data});
        }
    }))(Uploader);
