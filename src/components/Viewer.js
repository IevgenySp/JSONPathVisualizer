import React, { Component } from 'react';
import {connect} from "react-redux";
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import PropTypes from 'prop-types';

/**
 * SVG - element React hook
 * @param props
 * @returns {*}
 * @constructor
 */
function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

/**
 * SVG + element React hook
 * @param props
 * @returns {*}
 * @constructor
 */
function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

/**
 * Transition wrapper React hook
 * @param props
 * @returns {*}
 * @constructor
 */
function TransitionComponent(props) {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} expanded="true"/>);

const useStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});

/**
 * TreeView React hook
 * @param data
 * @returns {*}
 * @constructor
 */
function CustomizedTreeView(data) {
    const classes = useStyles();
    let itemIndex = 0;
    let color = '#000';

    const getChildren = parent => {
        return Object.keys(parent).map((key, index) => {
            itemIndex++;
            color = '#000';

            data.filteredData.forEach(item => {
                if (item.value === parent) {
                    color = 'red';
                } else if (item.value === parent[key]) {
                    color = 'red';
                }
            });

            return <StyledTreeItem nodeId={"" + itemIndex} label={!(parent[key] instanceof Object) && !Array.isArray(parent[key]) ? key + ': ' + parent[key] : key} key={index} style={{color: color}}>
               {renderMenu(parent[key])}
           </StyledTreeItem>
        });
    };
    const renderMenu = (items) => {
        let menuItem;
        let type;

        if (Array.isArray(items)) {
            type = 'array';
        } else if (items instanceof Object) {
            type = 'object';
        }

        switch(type) {
            case 'object':
                menuItem = getChildren(items);
                break;
            case "array":
                menuItem = items.map((item, index) => {
                    itemIndex++;
                    return <StyledTreeItem nodeId={"" + itemIndex} label="" key={index} style={{color: color}}>{getChildren(item)}</StyledTreeItem>
                });
                break;
        }

        return menuItem;
    };

    return (
        <TreeView
            className={classes.root}
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
        >
            {data.data === null ? null : renderMenu(data.data)}
        </TreeView>
    );
}

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
            expandedElements: ['1']
        };
    }

    componentDidUpdate() {
        if (this.props.data !== null) {
            this.setState({
                showComponent: true,
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.showComponent !== nextState.showComponent ||
            this.props.data !== nextProps.data ||
            this.props.filteredData !== nextProps.filteredData ||
            this.state.expandedElements !== nextState.expandedElements;
    }

    render() {
        let style = {
            display: this.state.showComponent ? 'flex' : 'none'
        };
        let treeStyle = {
            height: 264,
            flexGrow: 1,
            maxWidth: 400,
        };

        return (
            <div className="viewer" style={style}>
                <CustomizedTreeView data={this.props.data} filteredData={this.props.filteredData}/>
            </div>
        )
    }
}

export default connect((state, ownProps) => ({
        ownProps,
        data: state.JSONData,
        filteredData: state.FilteredData
    }),
    dispatch => ({
    }))(Viewer);
